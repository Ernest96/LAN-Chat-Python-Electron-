# this is for test purpose
import sys
import os
from user import User
from multicast_socket import MulticastSocket

str  = sys.stdin.readlines()
elements = str[0].split("|")

usr = User("", elements[2])
multicast_socket = MulticastSocket('224.0.0.224', 3000, usr)

usr.sendMessage(elements[0], elements[1], elements[3])