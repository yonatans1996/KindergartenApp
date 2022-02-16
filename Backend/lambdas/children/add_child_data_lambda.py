import logging


def add_child_data(event, context):
    logging.info(event)
    return "child was added to database (Not really)"