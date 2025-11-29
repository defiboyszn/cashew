import {motion} from "framer-motion";

const PageAnimate = ({children}: any) => {
    return (
        <motion.div className="flex flex-col w-full space-y-3 sm:pt-12" initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}>
            {children}
        </motion.div>
    )
}

export default PageAnimate;