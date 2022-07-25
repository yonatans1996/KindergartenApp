import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import moment from "moment";
import MonthPicker from "react-native-month-picker";

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderRadius: 5,
    width: "100%",
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    fontSize: 16,
    fontWeight: "500",
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 70,
  },
  confirmButton: {
    borderWidth: 0.5,
    padding: 15,
    margin: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

function MonthPickerModal({ placeholder, value, onChange }) {
  const [isOpen, toggleOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggleOpen(true)} style={styles.input}>
        <Text style={styles.inputText}>
          {value ? moment(value).format("MM/YYYY") : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <MonthPicker
              selectedDate={value || new Date()}
              onMonthChange={onChange}
              nextText="הבא"
              prevText="הקודם"
              yearDisabledStyle={{ color: "black" }}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => toggleOpen(false)}
            >
              <Text>אישור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

MonthPickerModal.defaultProps = {
  placeholder: "בחרו חודש להורדת הדוח",
};

export default React.memo(MonthPickerModal);
