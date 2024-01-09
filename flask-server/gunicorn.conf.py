import multiprocessing

bind = "0.0.0.0:8000"  # Specify the IP address and port to bind to
# Set the number of worker processes
workers = multiprocessing.cpu_count() * 2 + 1
timeout = 180  # Set the timeout value in seconds
accesslog = "access.log"  # Specify the path to the access log file
errorlog = "error.log"  # Specify the path to the error log file
