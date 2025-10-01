import { createNavigationContainerRef, StackActions } from "@react-navigation/native"

export const navigationRef = createNavigationContainerRef()

export default function popToSigninScreen(){
    console.log(navigationRef)

    if(!navigationRef.isReady()) return

    navigationRef.dispatch(StackActions.popToTop());
}