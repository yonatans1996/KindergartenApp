import logging
import datetime

from const import KINDERGARTEN_ID, GROUP_NUMBER, CHILD_ID, DATE, HAS_ARRIVED, EXTRA_DATA



def add_attendance_data(event, context):
    logging.info(event)

    return "attendance was added to database (Not really)"
