import ToggleMode from "./ToggleMode"

const Header = () => {
    return (
        <>
            <header className="bg-gradient-to-r from-[#1f1f1f] via-gray-800 to-[#1f1f1f] p-6 shadow-lg flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-white tracking-wide">
                    code<span className="text-cyan-400 drop-shadow-[0_0_5px_#00ffe7]">X</span>
                </h1>
                <ToggleMode />
            </header>
        </>
    )
}

export default Header;