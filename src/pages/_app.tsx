import AccountLayout from "../layout/wallet";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = AppProps & {
  Component: {
    getLayout: any;
  };
};

export default function App({ Component, pageProps }: Props) {
  const getLayout =
    Component?.getLayout ||
    ((page: any) => (
      <AccountLayout>
        <div className="z-[9999999999999999999999] relative">
          <ToastContainer position="bottom-center" bodyClassName={"z-[99999999999999]"} />
        </div>
        <div className="pb-5">{page}</div>
      </AccountLayout>
    ));

  return getLayout(<Component {...pageProps} />);
}
