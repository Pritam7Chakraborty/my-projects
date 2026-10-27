class Node:
    def __init__(self,data, next_node = None):
        self.data = data
        self.next = next_node

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_at_end(self,data):
        new_node = Node(data)