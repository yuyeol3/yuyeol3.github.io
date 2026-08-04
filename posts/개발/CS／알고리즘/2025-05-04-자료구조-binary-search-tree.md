# 자료구조 - Binary Search Tree

## 1. Linear Linked List

### 장점
- 삽입/삭제에 효율적
- 데이터 수를 미리 알 필요가 없음

### 단점
- 복잡성
- 동적 할당 비용
- 이진 탐색 사용이 불가

## 2. 선형 탐색

- $O(N)$의 시간 복잡도
  - 평균 $N/2$번의 비교

## 3. 높은 확률 정렬

- 자주 찾을 만한 원소를 앞에 배치
- 두 접근법
  - 최근에 탐색했던 원소를 가장 앞으로 옮김
  - 탐색한 원소를 이전 원소와 swap
- 부작용이 없다는 장점(worst case 에 영향 x)

## 4. Key Ordering
- SortedList를 만드는 두 가지 방법
  - 삽입 시 순서대로 정렬
  - 탐색 전에 정렬
- SortedList에서는
  - 아이템이 존재하지 않더라도 $N/2$ 회 안에 탐색
  - 이진 탐색 이용: $O(\log N)$ 보장

## 5. 트리의 정의

계층적 데이터 구조, root를 제외한 각각의 노드가 정확히 하나의 parent만 가짐


- Root: 유니크한 트리의 시작 노드
- Parent: 노드의 직전자(predecessor)
- Child: 노드의 직후자(successor)
- Leaf node: 직후자를 갖지 않는 노드
- Subtree : 전체 트리 안에서 어떤 child를 root로 갖는 작은 트리
- Level: root에서의 거리
  - root의 level: 0
- Height: 트리의 최대 level
- Siblings: 같은 level의 노드

## 6. 이진 트리의 정의


- 최대 2개의 자식 노드(left child, right child)를 가질 수 있는 트리
  - 레벨 N에는 최대 $2^N$개의 노드
- 각 노드에 최대 2개의 subtree가 존재
  - left subtree, right subtree

## 7. 코드

### 클래스 정의
```c++
template <typename T>
struct NodeType {
    T info;
    NodeType<T> *left;
    NodeType<T> *right;
};

template <typename T>
class TreeType
{
public:
    TreeType();
    ~TreeType();
    TreeType(const TreeType& orignalTree);
    void operator=(const TreeType& orignalTree);
    void MakeEmpty();
    bool IsEmpty() const;
    bool IsFull() const;
    int GetLength() const;
    T GetItem(T item, bool &found);
    void PutItem(T item);
    void DeleteItem(T item);
    void ResetTree(OrderType order);
private:
    NodeType<T>* tree;
    void Destroy(NodeType<T> *&tree);
    int CountNodes(NodeType<T>* tree);
    void Retrieve(NodeType<T> *tree, T &item, bool &found);
    void Insert(NodeType<T> *&tree, T item);
};
```

### 메소드 정의
- constructor
```c++
template <typename T>
TreeType<T>::TreeType()
: tree(NULL) 
{

}
```

- IsFull, IsEmpty
```c++
template <typename T>
bool TreeType<T>::IsFull() const {
    NodeType<T> *location;
    try {
        location = new NodeType<T>;
        delete location;
        return false;
    }
    catch(std::bad_alloc &e) {
        return true;
    }
}

template <typename T>
bool TreeType<T>::IsEmpty() const {
    return tree == NULL;
}
```

- GetLength
```c++
template <typename T>
int TreeType<T>::GetLength() const {
    return CountNodes(tree);
}

template <typename T>
int TreeType<T>::CountNodes(NodeType<T>* tree)
{
    if (tree == NULL)
        return 0;
    else
        return
        CountNodes(tree->left) + CountNodes(tree->right) + 1;
}

```

- GetItem
```c++
template <typename T>
T TreeType<T>::GetItem(T item, bool &found) {
    Retrieve(tree, item, found);
    return item;
}

template <typename T>
void TreeType<T>::Retrieve(NodeType<T> *tree, T &item, bool &found)
{
    if (tree == NULL)
        found = false;
    else if (item < tree->info)
        Retrieve(tree->left, item, found);
    else if( item > tree->info)
        Retrieve(tree->right, item, found);
    else {
        item = tree->info;
        found = true;
    }
}
```
- PutItem
```c++
template <typename T>
void TreeType<T>::PutItem(T item)
{
    Insert(tree, item);
}

template <typename T>
void TreeType<T>::Insert(NodeType<T> *&tree, T item)
{
    if (tree == NULL) {
        tree = new NodeType<T>;
        tree->right = NULL;
        tree->left = NULL;
        tree->info = item;
    }
    else if (item < tree->info)
        Insert(tree->left, item);
    else
        Insert(tree->right, item);
}
```

### DeleteItem

- 아이템 삭제 : 세 가지 경우
  - leaf node 삭제
  - child가 한 개인 node 삭제
  - child가 두 개인 node 삭제

```c++
template <typename T>
void TreeType<T>::DeleteItem(T item) {
    Delete(tree, item);            
}

template <typename T>
void TreeType<T>::Delete(NodeType<T> *&tree, T item) {
    if (item < tree->info)
        Delete(tree->left, item);  // 작은 경우 왼쪽
    else if (item > tree->info)
        Delete(tree->right, item); // 큰 경우 오른쪽
    else  // target found
        DeleteNode(tree);          // 찾은 경우-> 노드 삭제
}
```

### DeleteNode

```c++
template <typename T>
void TreeType<T>::DeleteNode(NodeType<T> *&tree)
{
    T data;
    NodeType<T> *tempPtr;
    tempPtr = tree;

    if ((tree->left == NULL) && (tree->right == NULL)) {  // leaf 노드 (자식이 없음)
        tree = NULL;
        delete tempPtr;
    }
    else if (tree->left == NULL) {     // 자식이 한 개
        tree = tree->right;
        delete tempPtr;
    } else if (tree->right == NULL) {  // 자식이 한 개
        tree = tree->left;
        delete tempPtr;
    } else {  // 자식이 두 개
        GetPredecessor(tree->left, data); // tree보다 작은 것 중 가장 큰 것

        tree->info = data;
        Delete(tree->left, data);
    }
}
```

- 자식이 없는 경우
  - tree를 NULL로 설정하고 할당 해제
- 자식이 한 개인 경우
  - 자식을 원래 자신의 자리에 넣고 자신을 할당 해제
- 자식이 두 개인 경우
  - tree보다 작은 것 중 가장 큰 노드를 찾아 자신의 자리에 넣고 자신을 할당 해제


### GetPredecessor
tree보다 작은 것 중 가장 큰 노드를 찾는 메서드

재귀적이지 않은 이유: 가장 오른쪽에 제일 큰 노드가 들어있기 때문

```c++
template <typename T>
void TreeType<T>::GetPredecessor(NodeType<T> *tree, T &data) 
{
    while (tree->right != NULL)
        tree = tree->right;
    data = tree->info;
}
```

## 8. 트리 구조에서의 순회
### Inorder traversal(순차적 순회)
Left subtree $\rightarrow$ Root $\rightarrow$ Right subtree

ex: 트리 내 모든 원소를 차례대로 출력하고 싶을 때

```c++
template <typename T>
void TreeType<T>::PrintTree(NodeType<T> *tree, std::ostream &os){
    if (tree != NULL) {
        PrintTree(tree->left, os);
        os << tree->info << ' ';
        PrintTree(tree->right, os);
    }
}

template <typename T>
void TreeType<T>::Print(std::ostream &os) {
    PrintTree(tree, os);
}
```


### Postorder traversal(후순차적 순회)
Left subtree $\rightarrow$  Right subtree $\rightarrow$ Root

ex: 트리의 할당을 해제할 때
```c++
template <typename T>
TreeType<T>::~TreeType() {
    Destroy(tree);
}

template <typename T>
void TreeType<T>::Destroy(NodeType<T>*& tree) {
    if (tree != NULL)
    {
        Destroy(tree->left);
        Destroy(tree->right);
        delete tree;
    }
};
```


### Preorder traversal(선순차적 순회)

Root $\rightarrow$ Left subtree $\rightarrow$ Right subtree

ex: 트리를 복제할 때
```c++
template <typename T>
void TreeType<T>::operator=(const TreeType& orignalTree) {
    CopyTree(tree, orignalTree);
}

template <typename T>
void TreeType<T>::CopyTree(NodeType<T> *&copy, const NodeType<T> *originalTree) {
    if (originalTree == NULL)
        copy = NULL;
    else {
        copy = new NodeType<T>;
        copy->info = originalTree->info;
        CopyTree(copy->left, originalTree->left);
        CopyTree(copy->right, originalTree->right);
    }
}

```

### ResetTree와 GetNextItem

- OrderType을 통해 어떤 방식으로 트리를 순회할 지 결정
- ResetTree는 특정 방식으로 순회한 큐를 생성
- GetNextItem은 지정한 방식에 따라 큐에서 원소를 꺼내며 순회

#### enum OrderType
```c++
enum OrderType {
    PRE_ORDER,
    IN_ORDER,
    POST_ORDER
};
```

#### class TreeQue
```c++
template <typename T>
class TreeQue : public std::deque<T> {
public:
    void PreOrder(NodeType<T> *tree) {
        if (tree != NULL) {
            this->push_back(tree->info);
            PreOrder(tree->left);
            PreOrder(tree->right);
        }
    }

    void InOrder(NodeType<T> *tree) {
        if (tree != NULL) {
            InOrder(tree->left);
            this->push_back(tree->info);
            InOrder(tree->right);
        }
    }

    void PostOrder(NodeType<T> *tree) {
        if (tree != NULL) {
            PostOrder(tree->left);
            PostOrder(tree->right);
            this->push_back(tree->info);
        }
    }

    T Dequeue() {
        T value = this->front();
        this->pop_front();
        return value;
    }

};
```

#### ResetTree, GetNextItem
```c++
template <typename T>
void TreeType<T>::ResetTree(OrderType order) {
    switch (order) {
        case PRE_ORDER : preQue.PreOrder(tree);
                         break;
        case IN_ORDER  : inQue.InOrder(tree);
                         break;
        case POST_ORDER : postQue.PostOrder(tree);
                         break;
    }
}

template <typename T>
T TreeType<T>::GetNextItem(OrderType order, bool &finished) {
    finished = false;
    T result;

    switch (order) {
        case PRE_ORDER : result = preQue.Dequeue();
                         if (preQue.empty()) finished = true;
                         break;
        case IN_ORDER : result = inQue.Dequeue();
                        if (inQue.empty()) finished = true;
                        break;
        case POST_ORDER : result = postQue.Dequeue();
                          if (postQue.empty()) finished = true;
                          break;
    }
    return result;
}

```

## 9. Iterative FindNode, PutItem, DeleteItem

```c++
template <typename T>
void FindNode(NodeType<T> *tree, T item,
     NodeType<T> *&nodePtr, NodeType<T> *&parentPtr) 
{
    nodePtr = tree;
    parentPtr = NULL;
    bool found = false;
    while (nodePtr != NULL && !found) {
        if (item < nodePtr->info) {
            parentPtr = nodePtr;
            nodePtr = nodePtr->left;
        } else if (item > nodePtr->info) {
            parentPtr = nodePtr;
            nodePtr = nodePtr->right;
        } 
        else 
            found = true;
    }
}

template <typename T>
void TreeType<T>::PutItemIter(T item)
{
    NodeType<T> *newNode;
    NodeType<T> *nodePtr;
    NodeType<T> *parentPtr;
    newNode = new NodeType<T>;
    newNode->info = item;
    newNode->left = NULL;
    newNode->right = NULL;

    FindNode(tree, item, nodePtr, parentPtr);

    if (parentPtr == NULL)
        tree = newNode;
    else if (item < parentPtr->info)
        parentPtr->left = newNode;
    else parentPtr->right = newNode;
}

template <typename T>
void TreeType<T>::DeleteItemIter(T item) {
    NodeType<T> *nodePtr;
    NodeType<T> *parentPtr;
    FindNode(tree, item, nodePtr, parentPtr);

    if (nodePtr == tree)
        DeleteNode(root);
    else {
        if (parentPtr->left == nodePtr)
            DeleteNode(parentPtr->left);
        else DeleteNode(parentPtr->right);
    }
}
```


## 10. 시간복잡도

| **Function**           | **Binary Search Tree** | **Array-based Linear List** | **Linked-list** |
|-------------------------|------------------------|-----------------------------|------------------|
| **Class constructor**   | O(1)                  | O(1)                        | O(1)            |
| **Destructor**          | O(N)                  | O(1)                        | O(N)            |
| **MakeEmpty**           | O(N)                  | O(1)                        | O(N)            |
| **GetLength**           | O(N)                  | O(1)                        | O(1)            |
| **IsFull**              | O(1)                  | O(1)                        | O(1)            |
| **IsEmpty**             | O(1)                  | O(1)                        | O(1)            |
| **GetItem**             |                        |                             |                  |
| - **Find**              | O(log2N)              | O(log2N)                    | O(N)            |
| - **Process**           | O(1)                  | O(1)                        | O(1)            |
| - **Total**             | O(log2N)              | O(log2N)                    | O(N)            |
| **PutItem**             |                        |                             |                  |
| - **Find**              | O(log2N)              | O(log2N)                    | O(N)            |
| - **Process**           | O(1)                  | O(N)                        | O(1)            |
| - **Total**             | O(log2N)              | O(N)                        | O(N)            |
| **DeleteItem**          |                        |                             |                  |
| - **Find**              | O(log2N)              | O(log2N)                    | O(N)            |
| - **Process**           | O(1)                  | O(N)                        | O(1)            |
| - **Total**             | O(log2N)              | O(N)                        | O(N)            |
