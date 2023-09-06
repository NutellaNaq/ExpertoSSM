const AutocompletePopup = (children: string[]) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minWidth: "200px" }}
    >
      {children}
    </div>
  );
};

export default AutocompletePopup;
