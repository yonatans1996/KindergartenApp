import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";

function ChildGroups({ value, setValue, groups }) {
  const [isFocus, setIsFocus] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    let groupsArr = [];
    groups.forEach((group) => groupsArr.push({ label: group, value: group }));
    setData(groupsArr);
  }, [groups]);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="בחר קבוצה"
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => {
        setIsFocus(false);
      }}
      onChange={(item) => {
        setIsFocus(false);
        setValue(item.label);
      }}
      renderLeftIcon={() => (
        <AntDesign
          style={styles.icon}
          color={isFocus ? "blue" : "black"}
          name="team"
          size={20}
        />
      )}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default ChildGroups;
