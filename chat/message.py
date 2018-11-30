import sys

class Message:
	time = None
	__data = ""
	__to = ""
	__from = ""
	__type = ""

	def __init__(self, data, to, _from, type):
		self.__data = data
		self.__from = _from
		self.__to = to
		self.__type = type

	def getData(self):
		return self.__data

	def getFrom(self):
		return self.__from

	def getTo(self):
		return self.__to

	def toString(self):
		return "{}|{}|{}|{}|{}".format(self.__data,
									self.__to,
									self.__from,
									self.__type,
									self.time)

	@staticmethod
	def parseStringToMessage(str):
		try:
			elements = str.split("|")
			message = Message(elements[0], elements[1], elements[2], elements[3])
			message.time = elements[4]
			return message
		except:
			message = None
			return message