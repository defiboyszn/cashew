import { useEffect, useRef, useState } from "react";

function PinCodeComp({}: {}) {
  const [pin, setPin] = useState([0]);
  //   const [pin1Clicked, setPin1Clicked] = useState(false);
  //   const [pin2Clicked, setPin2Clicked] = useState(false);
  //   const [pin3Clicked, setPin3Clicked] = useState(false);
  //   const [pin4Clicked, setPin4Clicked] = useState(false);

  const pin1 = useRef<HTMLInputElement>();
  const pin2 = useRef<HTMLInputElement>();
  const pin3 = useRef<HTMLInputElement>();
  const pin4 = useRef<HTMLInputElement>();

  useEffect(() => {
    window?.addEventListener("keydown", (e) => {
      if (e.key == "Backspace") {
        setPin((prev) => prev.slice(0, -1));
        console.log(pin);
      }
    });
  }, [pin]);

  useEffect(() => {
    pin1.current?.focus();
  }, []);

  return (
    <>
      <>
        <div className="w-full max-w-sm mx-auto">
          {/* <div className="flex flex-col p-6 space-y-1">
            <h3 className="whitespace-nowrap tracking-tight text-2xl font-bold">
              Enter PIN
            </h3>
            <p className="text-sm text-muted-foreground">
              Please enter your 4-digit PIN to unlock your wallet.
            </p>
          </div> */}
          <div className="p-6">
            <div className="flex justify-center space-x-2">
              <input
                // @ts-ignore
                ref={pin1}
                className="flex h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-20 text-center"
                maxLength={1}
                type="text"
                value={pin[0] || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (inputValue === "" && pin.length > 0) {
                    // Handle backspace: remove the last digit from the pin array
                    setPin((prev) => prev.slice(0, -1));
                    e.target.blur();
                  } else {
                    setPin((prev) => [...prev, Number(e.target.value)]);
                    setTimeout(() => {
                      e.target.type = "password";
                      e.target.value = "*";
                    }, 2000);
                    e.target.blur();
                    pin2.current?.focus();
                  }
                }}
              />
              <input
                // @ts-ignore
                ref={pin2}
                className="flex h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-20 text-center"
                maxLength={1}
                type="text"
                value={pin[1] || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (inputValue === "" && pin.length > 0) {
                    // Handle backspace: remove the last digit from the pin array
                    setPin((prev) => prev.slice(0, -1));
                    e.target.blur();
                  } else {
                    setPin((prev) => [...prev, Number(e.target.value)]);
                    setTimeout(() => {
                      e.target.type = "password";
                      e.target.value = "*";
                    }, 2000);
                    e.target.blur();
                    pin3.current?.focus();
                  }
                }}
              />
              <input
                // @ts-ignore
                ref={pin3}
                className="flex h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-20 text-center"
                maxLength={1}
                type="text"
                value={pin[2] || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (inputValue === "" && pin.length > 0) {
                    // Handle backspace: remove the last digit from the pin array
                    setPin((prev) => prev.slice(0, -1));
                    e.target.blur();
                  } else {
                    setPin((prev) => [...prev, Number(e.target.value)]);
                    setTimeout(() => {
                      e.target.type = "password";
                      e.target.value = "*";
                    }, 2000);
                    e.target.blur();
                    pin4.current?.focus();
                  }
                }}
              />
              <input
                // @ts-ignore
                ref={pin4}
                className="flex h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-20 text-center"
                maxLength={1}
                type="text"
                value={pin[3] || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (inputValue === "" && pin.length > 0) {
                    // Handle backspace: remove the last digit from the pin array
                    setPin((prev) => prev.slice(0, -1));
                    e.target.blur();
                  } else {
                    setPin((prev) => [...prev, Number(e.target.value)]);
                    setTimeout(() => {
                      e.target.type = "password";
                      e.target.value = "*";
                    }, 2000);
                    e.target.blur();
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(1)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                1
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(2)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                2
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(3)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                3
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(4)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                4
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(5)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                5
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(6)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                6
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(7)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                7
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(8)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                8
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(9)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                9
              </button>
              <button
                onClick={() => {
                  setPin((prev) => [...prev, Number(0)]);
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                0
              </button>
              <button
                onClick={() => {
                  setPin((prev) => prev.slice(-4, -1));
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-white h-24 px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={12}
                  viewBox="0 0 16 12"
                  fill="none"
                >
                  <path
                    d="M4.42259 1.52194C4.71085 1.22448 4.70339 0.74967 4.40594 0.46141C4.10848 0.173151 3.63367 0.180605 3.34541 0.47806L4.42259 1.52194ZM0.46141 3.45406C0.173151 3.75152 0.180605 4.22633 0.47806 4.51459C0.775515 4.80285 1.25033 4.79539 1.53859 4.49794L0.46141 3.45406ZM1.52244 3.43789C1.22525 3.14936 0.750425 3.15638 0.461891 3.45356C0.173358 3.75075 0.180375 4.22558 0.477564 4.51411L1.52244 3.43789ZM3.36156 7.31411C3.65875 7.60264 4.13358 7.59562 4.42211 7.29844C4.71064 7.00125 4.70362 6.52642 4.40644 6.23789L3.36156 7.31411ZM1 3.226C0.585786 3.226 0.25 3.56179 0.25 3.976C0.25 4.39021 0.585786 4.726 1 4.726V3.226ZM11.62 3.976L11.6347 3.22614C11.6298 3.22605 11.6249 3.226 11.62 3.226V3.976ZM15 7.488L14.2501 7.47394C14.25 7.48331 14.25 7.49269 14.2501 7.50206L15 7.488ZM11.62 11V11.75C11.6249 11.75 11.6298 11.75 11.6347 11.7499L11.62 11ZM1 10.25C0.585786 10.25 0.25 10.5858 0.25 11C0.25 11.4142 0.585786 11.75 1 11.75V10.25ZM3.34541 0.47806L0.46141 3.45406L1.53859 4.49794L4.42259 1.52194L3.34541 0.47806ZM0.477564 4.51411L3.36156 7.31411L4.40644 6.23789L1.52244 3.43789L0.477564 4.51411ZM1 4.726H11.62V3.226H1V4.726ZM11.6053 4.72586C13.0943 4.75496 14.2781 5.98497 14.2501 7.47394L15.7499 7.50206C15.7933 5.18528 13.9514 3.27143 11.6347 3.22614L11.6053 4.72586ZM14.2501 7.50206C14.2781 8.99103 13.0943 10.221 11.6053 10.2501L11.6347 11.7499C13.9514 11.7046 15.7933 9.79072 15.7499 7.47394L14.2501 7.50206ZM11.62 10.25H1V11.75H11.62V10.25Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default PinCodeComp;
