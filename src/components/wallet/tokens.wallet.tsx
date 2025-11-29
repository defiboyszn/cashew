import search from '../../assets/icons/search.svg'
import {Back} from '../global/back.global';
import {TokensList} from "@/components/tokens/tokens.list";
import {useState} from "react";
import {routes} from "@/app/utils/routes";

function TokensComp() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <>
            <div className="flex flex-col w-full pb-4 sm:pt-12">
                <div className="sticky z-10 pt-5 pb-3 top-20 bg-cgray-25">
                    <Back/>
                    <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
                        <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">All Assets</h1>
                    </div>

                    <div className="inline-flex flex-col items-start justify-start w-full gap-2 h-14">
                        <div
                            className="w-full h-14 px-4 py-[18px] bg-cgray-25 rounded-lg border border-gray-300 justify-start items-center gap-2 inline-flex">
                            <img src={search?.src} alt="Search"/>
                            <input type="text" value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for asset"
                                   className="text-sm font-light leading-tight text-gray-500 grow shrink basis-0 focus:outline-none"/>
                        </div>
                    </div>
                </div>

                <TokensList searchTerm={searchTerm} routePrefix={routes.token()}/>
            </div>
        </>
    );
}

export default TokensComp;

