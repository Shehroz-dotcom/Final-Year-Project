export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
    color: "white",
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#000",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#48bb78" : "#000",
    color: state.isSelected ? "#fff" : "#fff",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#38a169", // darker green on hover
      color: "#fff",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "rgba(72, 187, 120, 0.5)",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff", // <-- make selected single option white
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#fff", // placeholder in white
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "red", // make the X red
    ":hover": {
      color: "#ff4d4f",
    },
  }),
};
