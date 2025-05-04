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
