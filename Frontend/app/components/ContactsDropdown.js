import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";

function ContactsDropDown({ contacts, value, setValue, setId }) {
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {});

  return (
    // <Dropdown
    //   style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
    //   placeholderStyle={styles.placeholderStyle}
    //   selectedTextStyle={styles.selectedTextStyle}
    //   search
    //   searchPlaceholder="חפש איש קשר"
    //   inputSearchStyle={styles.inputSearchStyle}
    //   iconStyle={styles.iconStyle}
    //   data={contacts}
    //   maxHeight={300}
    //   labelField="label"
    //   valueField="value"
    //   placeholder="אנשי קשר"
    //   value={value}
    //   onFocus={() => setIsFocus(true)}
    //   onBlur={() => {
    //     setIsFocus(false);
    //   }}
    //   onChange={(item) => {
    //     setIsFocus(false);
    //     setId(item.value);
    //     setValue(item.label);
    //   }}
    //   renderLeftIcon={() => (
    //     <AntDesign
    //       style={styles.icon}
    //       color={isFocus ? "blue" : "black"}
    //       name="team"
    //       size={20}
    //     />
    //   )}
    // />
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={contacts}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? "אנשי קשר" : "..."}
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setId(item.value);
        setIsFocus(false);
      }}
      renderLeftIcon={() => (
        <AntDesign
          style={styles.icon}
          color={isFocus ? "blue" : "black"}
          name="contacts"
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

export default ContactsDropDown;
