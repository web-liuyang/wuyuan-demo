import React, { FC, useRef, useState } from "react";
import { Tree, Modal, message } from "antd";
import { DataNode } from "rc-tree/lib/interface";
import { local } from "l-browser-storage";
import { getTreeDataItem } from "@/utils";
import useUpdate from "@/hooks/useUpdate";
import "./index.less";

type HandleCheckTreeProps =
  | {
      checked: React.Key[];
      halfChecked: React.Key[];
    }
  | React.Key[];

const IndexPage: FC = () => {
  // 数据
  const [treeData, setTreeData] = useState<DataNode[]>(
    local.get("treeData").data || []
  );
  // 默认选中
  const [defaultCheckedKeys] = useState<string[]>(
    local.get("defaultCheckedKeys").data || []
  );
  // 选择的key
  const [selectorTreeKey, setSelectorTreeKey] = useState<string>("");
  // 受控
  const oInput = useRef<HTMLInputElement>(null);
  // 修改模态框
  const [editModal, setEditModal] = useState<boolean>(false);
  // 增加模态框
  const [addModal, setAddModal] = useState<boolean>(false);

  // 只在更新时才触发的hooks
  useUpdate((): void => {
    local.set("treeData", treeData);
  }, [treeData]);

  // 改变check状态
  const handleCheckTree = (checked: HandleCheckTreeProps): void => {
    local.set("defaultCheckedKeys", checked);
  };

  // 操作Todo
  const handleActionTodo = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    type: "edit" | "add",
    key: string
  ): void => {
    e.stopPropagation(); // 停止传播
    setSelectorTreeKey(key); // 设置选择的key
    switch (type) {
      case "edit":
        setEditModal(true); // 显示Edit Title模态框
        break;
      case "add":
        setAddModal(true); // 显示Add ToDo模态框
        break;
      default:
        break;
    }
  };

  // 确定Edit Title模态框
  const handleSureEditModal = (): void => {
    setTreeData((oVal) => {
      const item = getTreeDataItem(oVal, selectorTreeKey); // 获取treeDataItem
      const value = oInput.current?.value; // 修改的值

      if (!value) {
        message.warning("请填写值");
        return oVal;
      }
      if (value.trim() === (item.title as string).trim()) {
        message.warning("与上次值相等");
        return oVal;
      }

      item.title = value; // 赋值
      oInput.current!.value = ""; // 清空
      setEditModal(false); // 关闭模态框

      return [...oVal];
    });
  };

  // 确定Add ToDO模态框
  const handleSureAddModal = (): void => {
    setTreeData((oVal) => {
      const item = getTreeDataItem(oVal, selectorTreeKey); // 获取treeDataItem
      const keys = selectorTreeKey
        ? selectorTreeKey.split("-").map((idx) => parseInt(idx))
        : [];
      const value = oInput.current?.value; // 增加的值

      if (!value) {
        message.warning("请填写值");
        return oVal;
      }

      // 是否有值
      if (selectorTreeKey) {
        item.children = item.children || []; // 是否有子集
        keys.push(item.children.length); // 增加key
        item.children.push({ key: keys.join("-"), title: value }); // 添加Todo
      } else {
        keys.push(oVal.length); // 增加key
        oVal.push({ key: keys.join("-"), title: value }); // 添加Todo
      }
      oInput.current!.value = ""; // 清空
      setAddModal(false); // 关闭模态框

      return [...oVal];
    });
  };

  // 自定义返回
  const titleRender = (node: DataNode): React.ReactNode => {
    return (
      <div className="flex-center">
        <div className="mr-10 title">{node.title}</div>
        <div>
          <img
            className="mr-10"
            src={require("@image/edit.png")}
            alt="edit"
            onClick={(e) => handleActionTodo(e, "edit", node.key as string)}
          />
          <img
            src={require("@image/add.png")}
            alt="add"
            onClick={(e) => handleActionTodo(e, "edit", node.key as string)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="page index-page">
      <div className="absolute-center p-24 border wrapper">
        <div className="flex-center justify-content-start">
          <span className="mr-10 f22 f-600">To Do</span>
          <img
            alt="add"
            src={require("@image/add.png")}
            onClick={(e) => handleActionTodo(e, "add", "")}
          />
        </div>
        <Tree
          checkable
          selectable={false}
          defaultCheckedKeys={defaultCheckedKeys}
          onCheck={handleCheckTree}
          treeData={treeData}
          titleRender={titleRender}
        />
        {/* Edit Title模态框 S */}
        <Modal
          title="Edit Title"
          centered
          visible={editModal}
          onOk={handleSureEditModal}
          onCancel={() => setEditModal(false)}
        >
          <div>
            <input ref={oInput} placeholder="请输入新值" maxLength={20} />
          </div>
        </Modal>
        {/* Edit Title模态框 E */}

        {/* Add ToDo模态框 S */}
        <Modal
          title="Add ToDo"
          centered
          visible={addModal}
          onOk={handleSureAddModal}
          onCancel={() => setAddModal(false)}
        >
          <div>
            <input ref={oInput} placeholder="请输入新值" maxLength={20} />
          </div>
        </Modal>
        {/* Add ToDo模态框 E */}
      </div>
    </div>
  );
};

export default IndexPage;
