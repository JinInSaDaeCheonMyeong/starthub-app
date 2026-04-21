import { createNavigationContainerRef } from "@react-navigation/native"

export const navigationRef = createNavigationContainerRef()

export default function popToSigninScreen(){
    if(!navigationRef.isReady()) return

    navigationRef.reset({
        index: 0,
        routes: [
            {
                name: "AuthStack" as any,
                state: {
                    routes: [{ name: "Signin" }],
                    index: 0,
                },
            },
        ]
    })
}
