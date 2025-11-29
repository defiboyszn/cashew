import AuthLayout from "../layout/account";
import ImportAccount from "@/components/account/import.account";

export default function CreateAccount() {
    return (
        <ImportAccount/>
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