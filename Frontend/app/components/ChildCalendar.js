import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";
export default function ChildCalendar({ childInfo, accessToken }) {
  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" };
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" };
  const workout = { key: "workout", color: "green" };
  const [datesObj, setDatesObj] = useState({});
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

  const createCalendarObj = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const respond = await fetch(
      "https://api.kindergartenil.com/attendance?child_id=" +
        childInfo.child_id,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log("error getting calendar dates: ", error));

    const arrivedDates = respond.arrived;
    console.log("arrived dates = ", arrivedDates);
    const notifiedMissing = respond.notified_missing;
    console.log("notifiedMissing dates = ", notifiedMissing);
    let datesObj = {};
    arrivedDates.forEach((date) => {
      let newDate = buildSingleObj(date, "green");
      datesObj = { ...datesObj, ...newDate };
    });
    notifiedMissing.forEach((date) => {
      let newDate = buildSingleObj(date, "orange");
      datesObj = { ...datesObj, ...newDate };
    });
    return datesObj;
    /*
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
    */
  };

  const buildSingleObj = (date, color) => {
    var obj = {};
    obj[date] = {
      customStyles: {
        container: {
          backgroundColor: color,
        },
        text: {
          color: "white",
          fontWeight: "bold",
        },
      },
    };
    return obj;
  };

  useEffect(() => {
    createCalendarObj().then((res) => {
      setDatesObj(res);
    });
  }, []);
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
      markedDates={datesObj}
    />
  );
}
