const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const marker = 'RN 0.83 DevTools disables Network inspection';
const nodeBinaryMarker = 'def project_node_binary';

const nodeBinaryPatch = `require 'shellwords'

def project_node_binary
  env_file = File.join(__dir__, '.xcode.env.local')
  if File.exist?(env_file)
    File.foreach(env_file) do |line|
      line = line.strip
      match = line.match(/\\Aexport NODE_BINARY=(.+)\\z/)
      return match[1].strip.gsub(/\\A['"]|['"]\\z/, '') if match
    end
  end

  ENV['NODE_BINARY'] || 'node'
end

node_binary = Shellwords.escape(project_node_binary)
ENV['NODE_BINARY'] ||= project_node_binary
node_binary_dir = File.dirname(project_node_binary)
path_entries = ENV['PATH'].to_s.split(File::PATH_SEPARATOR).reject { |entry| entry == node_binary_dir }
ENV['PATH'] = ([node_binary_dir] + path_entries).join(File::PATH_SEPARATOR)

`;

const patch = `
    # RN 0.83 DevTools disables Network inspection when Worklets registers its
    # Hermes debug runtime as another inspectable target. Skip that Worklets
    # debug target while keeping Hermes and the app's normal inspector enabled.
    installer.pods_project.targets.each do |target|
      next unless target.name == 'RNWorklets'

      target.build_configurations.each do |build_config|
        next unless build_config.name == 'Debug'

        definitions = build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        definitions = definitions.split(' ') if definitions.is_a?(String)
        definitions << 'HERMES_V1_ENABLED=1' unless definitions.include?('HERMES_V1_ENABLED=1')
        build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = definitions
      end
    end
`;

function addWorkletsHermesDebuggerFix(contents) {
  if (contents.includes(marker)) {
    return contents;
  }

  const anchor = [
    '    react_native_post_install(',
    '      installer,',
    '      config[:reactNativePath],',
    '      :mac_catalyst_enabled => false,',
    '      :ccache_enabled => ccache_enabled?(podfile_properties),',
    '    )',
  ].join('\n');

  if (!contents.includes(anchor)) {
    throw new Error('Could not find react_native_post_install block in ios/Podfile.');
  }

  return contents.replace(anchor, `${anchor}\n${patch}`);
}

function addProjectNodeBinaryResolver(contents) {
  if (contents.includes(nodeBinaryMarker)) {
    return contents;
  }

  const expoRequire =
    'require File.join(File.dirname(`node --print "require.resolve(\\\'expo/package.json\\\')"`), "scripts/autolinking")';
  const reactNativeRequire =
    'require File.join(File.dirname(`node --print "require.resolve(\\\'react-native/package.json\\\')"`), "scripts/react_native_pods")';
  const patchedExpoRequire =
    'require File.join(File.dirname(`#{node_binary} --print "require.resolve(\\\'expo/package.json\\\')"`), "scripts/autolinking")';
  const patchedReactNativeRequire =
    'require File.join(File.dirname(`#{node_binary} --print "require.resolve(\\\'react-native/package.json\\\')"`), "scripts/react_native_pods")';

  if (!contents.includes(expoRequire) || !contents.includes(reactNativeRequire)) {
    return contents;
  }

  return contents
    .replace(expoRequire, `${nodeBinaryPatch}${patchedExpoRequire}`)
    .replace(reactNativeRequire, patchedReactNativeRequire);
}

module.exports = function withWorkletsHermesDebuggerFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      const contents = fs.readFileSync(podfilePath, 'utf8');
      fs.writeFileSync(
        podfilePath,
        addWorkletsHermesDebuggerFix(addProjectNodeBinaryResolver(contents))
      );
      return config;
    },
  ]);
};
