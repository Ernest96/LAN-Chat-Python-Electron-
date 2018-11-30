import socket
import sys
import threading, Queue
from time import sleep
from message import Message

class MulticastSocket:
	__port = ""
	__ip = ""
	__bind_addr = ""
	__queue = None
	__userid = None
	__messages = dict()
	sock = None
	__queue = None

	def __init__(self, ip, port, user):
		self.__port = port
		self.__ip = ip
		self.__bind_addr = '0.0.0.0'
		self.__userid = str(user)
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		membership = socket.inet_aton(self.__ip) + socket.inet_aton(self.__bind_addr)
		self.sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, membership)
		self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
		self.sock.bind((self.__bind_addr, self.__port))
		self.__queue = Queue.Queue()
		t1 = threading.Thread(target=self.__receive, args=[])
		t1.start()
		t2 = threading.Thread(target=self.__unpackMessages, args=[self.__userid])
		t2.start()
		

	def __receive(self):
		while True:
			message, address =  self.sock.recvfrom(255)
			self.__queue.put(message)
			

	def __unpackMessages(self, id):
		user_id = id
		while True:
			result = ""
			while not self.__queue.empty():
				m = self.__queue.get()
				obj_message = Message.parseStringToMessage(m)
				if obj_message == None:
					continue
				if obj_message.getTo() == "all" or obj_message.getTo() == user_id:
					if obj_message.getFrom() != user_id:
						result = result + m + "|END|"

			if len(result) > 0:
				print str(result)
				sys.stdout.flush()
			sleep(0.8)