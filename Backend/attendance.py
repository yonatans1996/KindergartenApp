import logging
import datetime

from const import KINDER_GARTEN_ID, GROUP_NUMBER, CHILD_ID, DATE, HAS_ARRIVED, EXTRA_DATA


def get_attendance_data(event, context):
    # TODO get the children id from the event
    logging.info(event)
    result = {
        CHILD_ID: '4',
        KINDER_GARTEN_ID: '1',
        DATE: str(datetime.datetime.now()),
        HAS_ARRIVED: 'yes',
        GROUP_NUMBER: '1',
        EXTRA_DATA: {'poop_number': 3}
    }
    return result


def add_attendance_data(event, context):
    logging.info(event)

    return "attendance was added to database (Not really)"
