import logging
from datetime import date

import boto3

from const import ATTENDANCE_TABLE, ATTENDANCE_PK, ATTENDANCE_SK, KINDERGARTEN_ID, HAS_ARRIVED


class AttendanceHandler:

    @staticmethod
    def add_attendance(child_id: str, kindergarten_id: str, has_arrived: str):
        attendance_table = table = boto3.resource('dynamodb').Table(ATTENDANCE_TABLE)

        new_attendance = {
            ATTENDANCE_PK: child_id,
            ATTENDANCE_SK: str(date.today()),
            KINDERGARTEN_ID: kindergarten_id,
            HAS_ARRIVED: has_arrived
        }
        try:
            attendance_table.put_item(Item=new_attendance)
        except Exception as e:
            logging.error(f'Cannot put {new_attendance} in {ATTENDANCE_TABLE}, {str(e)}')