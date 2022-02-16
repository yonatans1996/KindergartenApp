import logging
import datetime

from const import KINDERGARTEN_ID, GROUP_NUMBER, CHILD_ID, DATE, HAS_ARRIVED, EXTRA_DATA


def get_attendance_data(event, context):
    # TODO get the children id from the event
    logging.info(event)
    result = [
        {
            CHILD_ID: '4',
            KINDERGARTEN_ID: '1',
            DATE: str(datetime.datetime.now()),
            HAS_ARRIVED: 'yes',
            GROUP_NUMBER: '1',
            EXTRA_DATA: {'poop_number': 3}
        }
        ,
        {
            CHILD_ID: '5',
            KINDERGARTEN_ID: '1',
            DATE: str(datetime.datetime.now()),
            HAS_ARRIVED: 'yes',
            GROUP_NUMBER: '1',
            EXTRA_DATA: {'poop_number': 3}
        },
        {
            CHILD_ID: '6',
            KINDERGARTEN_ID: '1',
            DATE: str(datetime.datetime.now()),
            HAS_ARRIVED: 'yes',
            GROUP_NUMBER: '1',
            EXTRA_DATA: {'poop_number': 3}
        }
    ]

    return result
