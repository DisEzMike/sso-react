import lineIcon from '../../assets/line.svg'

type LineButtonProp = {
  disabled?: boolean;
}

function LineButton(prop: LineButtonProp) {
  const {disabled} = prop;
    return ( 
        <>
          <button 
            disabled={disabled}
            onClick={() => console.log("click")}
            className="flex w-full items-center justify-center disabled:bg-gray-400 disabled:text-stone-900 bg-white dark:bg-stone-900 transition-all ease-in duration-75 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-stone-800 hover:text-stone-200 shadow-lg ring-1 ring-black/5">
              <img src={lineIcon} alt="Line Logo" className="w-6 h-6 mr-2" />
              <span>Continue with Line</span>
          </button>     
        </>
     );
}

export default LineButton;