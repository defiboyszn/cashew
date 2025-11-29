import React, {useEffect, useState} from 'react';
import {Html5Qrcode, Html5QrcodeScanner, QrcodeErrorCallback} from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
    fps?: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    qrCodeSuccessCallback: (qrCodeMessage: string) => void;
    close: () => void;
    qrCodeErrorCallback?: (errorMessage: string) => void;
}

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (function HTML5QrcodePlugin(props) {
    const [canRestart, setCanRestart] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

    const closeScanner = () => {
        reset();
        props.close()
    }
    const startScanner = (cameraId: any, devicesCount: any) => {
        const state = html5QrCode?.getState()
        if (state === 1 || state === 0 || state === undefined) {
            html5QrCode?.start(
                devicesCount > 1 ? {facingMode: "environment"} : cameraId,
                createConfig(props),
                (decodedText, decodedResult) => {
                    props.qrCodeSuccessCallback(decodedText)
                    closeScanner();
                },
                (errorMessage) => {
                    // console.log(errorMessage)
                    // parse error, ignore it.
                }).then(() => {
                setLoading(false);
            }).catch((err) => {
                console.log(err)
            });
        }

    }
    useEffect(() => {
        console.log(canRestart);
        if (!canRestart) {
            Html5Qrcode.getCameras().then(devices => {
                if (devices && devices.length) {
                    const cameraId = devices[0].id;
                    startScanner(cameraId, devices.length)
                }

            }).catch(err => {
                console.log(err);
            });
        }
    }, [canRestart, html5QrCode]);

    const reset = () => {
        const state = html5QrCode?.getState()
        if (state !== 1)
            html5QrCode?.stop().then();
    }

    useEffect(() => {
        if (canRestart) {
            setHtml5QrCode(new Html5Qrcode("reader"))
            setCanRestart(false);
        }


        return () => {
            reset()
        };
    }, []);

    const createConfig = (props: Html5QrcodePluginProps) => {
        let config: any = {};
        if (props.fps) {
            config.fps = props.fps;
        }
        if (props.aspectRatio) {
            config.aspectRatio = props.aspectRatio;
        }
        if (props.disableFlip !== undefined) {
            config.disableFlip = props.disableFlip;
        }
        return config;
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex flex-col bg-black/40 justify-center p-4">
            <div className="py-4 rounded-lg border-blue-500 max-w-[600px] relative w-full mx-auto bg-white">
                <div className="h-[500px] flex items-center justify-center w-full absolute">
                    <div
                        className="border-x-primary w-8 animate-spin h-8 opacity-60 border-4 rounded-full border-y-primary-light"></div>
                </div>
                <div className="relative w-full overflow-hidden px-4">
                    <div id={"reader"} className={"rounded-lg overflow-hidden min-h-[500px] relative"}>
                    </div>
                    <div className="px-4 absolute w-full h-full z-10 top-0 left-0">
                        <div className="overflow-hidden rounded-lg w-full h-full flex items-center justify-center ">
                            <div className="rounded-3xl"
                                 style={{
                                     width: '200px',
                                     height: '200px',
                                     boxShadow: '0px 0px 1000px 1000px rgba(0, 0, 0, 0.4)',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                 }}
                            >
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 px-4">
                    <button onClick={closeScanner}
                            className="bg-primary w-full mt-4 py-5 text-white rounded-lg font-medium">Close
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Html5QrcodePlugin;
