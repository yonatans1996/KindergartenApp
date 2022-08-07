import React, { useEffect, useState, useContext } from "react";
import { Alert } from "react-native";
import { Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { AuthContext } from "../Context/AuthContext";
import Feather from "react-native-vector-icons/Feather";
export default function ChildCalendar({ childInfo, accessToken }) {
  const [datesObj, setDatesObj] = useState({});
  const { user } = useContext(AuthContext);
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

  const createCalendarObj = async (month) => {
    if (!accessToken || !childInfo) {
      console.log("dont have info for calendar. stopping");
      return;
    }
    console.log("GOT MONTH = ", month);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    console.log("getting attendance for child id = ", childInfo.child_id);
    let url =
      "https://api.kindergartenil.com/attendance?child_id=" +
      childInfo.child_id;
    if (month) {
      url += "&month=" + month;
    }
    console.log("URL " + url);
    const respond = await fetch(url, requestOptions)
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
    setDatesObj(datesObj);
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
  const notifyMissing = (day, message) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      attendance_date: `${day.year}-${
        day.month < 10 ? `0${day.month}` : day.month
      }-${day.day < 10 ? `0${day.day}` : day.day}`,
      id: childInfo.child_id,
      is_present: message,
    });
    console.log("notify missing raw data = ", raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/parent/attendance", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("notify missing result = ", result);
        createCalendarObj();
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    createCalendarObj();
  }, [childInfo]);
  return (
    <Calendar
      hideExtraDays={true}
      onDayPress={(day) => {
        console.log("selected day", day);
        const buttonOptionsParent = [
          {
            text: "חזרה",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "ביטול אי הגעה",
            onPress: () => notifyMissing(day, "no"),
            style: "cancel",
          },
          {
            text: "דיווח לא מגיע",
            onPress: () => notifyMissing(day, "notified_missing"),
          },
        ];
        const buttonOptionsTeacher = [
          {
            text: "חזרה",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "ביטול הגעה",
            onPress: () => notifyMissing(day, "no"),
            style: "cancel",
          },
          {
            text: "סימון הגעה",
            onPress: () => notifyMissing(day, "yes"),
          },
        ];
        console.log("USER type = ", user);
        const buttonOptions =
          user.type == "teacher" ? buttonOptionsTeacher : buttonOptionsParent;
        Alert.alert(
          "דיווח נוכחות",
          `תאריך: ${day.day}/${day.month}/${day.year}`,
          buttonOptions
        );
      }}
      renderHeader={(date) => (
        <Text>
          דוח נוכחות של {childInfo.first_name} לחודש{" "}
          {monthNames[date.getMonth()]}
        </Text>
      )}
      renderArrow={(direction) => (
        <Feather
          name={direction === "right" ? "arrow-left" : "arrow-right"}
          color="green"
          size={20}
        />
      )}
      markingType={"custom"}
      markedDates={datesObj}
      onMonthChange={(date) => {
        console.log("month changed", date);
        createCalendarObj(date.month);
      }}
    />
  );
}
