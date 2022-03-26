import React from "react";
import { Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";
export default function ChildCalendar({ childInfo }) {
  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" };
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" };
  const workout = { key: "workout", color: "green" };
  const monthNames = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אקוטובר",
    "נובמבר",
    "דצמבר",
  ];

  return (
    <Calendar
      hideArrows={true}
      hideExtraDays={true}
      renderHeader={(date) => (
        <Text>
          דוח נוכחות של {childInfo.first_name} לחודש{" "}
          {monthNames[date.getMonth()]}
        </Text>
      )}
      markingType={"custom"}
      markedDates={{
        "2022-03-20": {
          customStyles: {
            container: {
              backgroundColor: "green",
            },
            text: {
              color: "white",
              fontWeight: "bold",
            },
          },
        },
        "2022-03-21": {
          customStyles: {
            container: {
              backgroundColor: "green",
            },
            text: {
              color: "white",
              fontWeight: "bold",
            },
          },
        },
        "2022-03-22": {
          customStyles: {
            container: {
              backgroundColor: "red",
            },
            text: {
              color: "white",
              fontWeight: "bold",
            },
          },
        },
      }}
    />
  );
}
