import socket
import uuid
import struct
import time
from message import Message

class User:
	__id = ""
	__name = ""
	__sock = None

	def __init__(self, name, ids):
		self.__id = ids
		self.__name = name
		self.__sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		ttl = struct.pack('b', 1)
		self.__sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, ttl)
		self.__sock.bind(('', 0))

	

	def getId(self):
		return str(self.__id)

	def sendMessage(self, data, to, type):
		message = Message(data, to, self.__id, type)
		message.time = time.asctime( time.localtime(time.time()))
		self.__sock.sendto(message.toString(), ("224.0.0.224", 3000))

	def toString(self):
		return " id = {}\n name = {}\n port = {}\n".format(self.__id,
														self.__name,
														self.__sock.getsockname()[1])