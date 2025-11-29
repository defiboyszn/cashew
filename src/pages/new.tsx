import RegisterComp from "@/components/account/create.account";
import AuthLayout from "../layout/account";

export default function CreateAccount() {
    return (
        <RegisterComp/>
    )
}

CreateAccount.getLayout = function (page: any) {
    return (
        <>
            <AuthLayout>
                {page}
            </AuthLayout>
        </>
    )
}