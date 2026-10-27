# class Node:
#     def __init__(self,data,next = None):
#         self.data = data
#         self.next = next

# if __name__ == "__main__":
#     arr = [2,5,7,8]

#     y = Node(arr[0])

#     print(y)
#     print(y.data)

#.............................................................................................................................

# class Node:
#     def __init__(self,data1, next1 = None):
#         self.data = data1
#         self.next = next1

# class Solution:
#     def insertAtHead(self, head, newData):
#         newNode = Node(newData, head)
#         return newNode

#     def deleteLast(self, )

#     def printList(self, head):
#         temp = head
#         while temp:
#             print(temp.data, end=" ")
#             temp = temp.next
#         print()


# if __name__ == "__main__":
#     sol = Solution()

#     head = Node(2)
#     head.next = Node(3)

#     print("Original List:", end=" ")
#     sol.printList(head)

#     head = sol.insertAtHead(head, 1)

#     print("After Insertion at Head:", end=" ")
#     sol.printList(head)