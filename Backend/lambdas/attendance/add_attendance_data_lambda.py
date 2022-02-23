import logging

from shared.AttendanceHandler import AttendanceHandler


def add_attendance_data(event, context):
    return event
    response = AttendanceHandler.add_attendance(child_id='test_child_id', kindergarten_id='test_kindergarten_id',
                                                has_arrived='test_has_arrived')


