import sys
from user import User
from multicast_socket import MulticastSocket
import uuid

usr = User("Ernest", uuid.uuid4())
multicast_socket = MulticastSocket('224.0.0.224', 3000, usr.getId())
a = usr.getId()
print(usr.getId())
sys.stdout.flush()

raw_input("")