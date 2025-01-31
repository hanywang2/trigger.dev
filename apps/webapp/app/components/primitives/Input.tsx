import classNames from "classnames";

const roundedStyles = {
  roundedLeft: "rounded-l -mr-1",
  roundedRight: "rounded-r -ml-1",
  roundedFull: "rounded",
};

type InputProps = JSX.IntrinsicElements["input"] & {
  roundedEdges?: "roundedLeft" | "roundedRight" | "roundedFull";
};

export function Input({
  children,
  className,
  roundedEdges = "roundedFull",
  ...props
}: InputProps) {
  const classes = classNames(roundedStyles[roundedEdges], className);

  return (
    <input
      {...props}
      className={classNames(
        `flex grow py-2 pl-4 pr-1 text-slate-200 rounded border-none bg-black/20 group-focus:border-indigo-500 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`,
        classes
      )}
    >
      {children}
    </input>
  );
}
