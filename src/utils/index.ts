import { DataNode } from "rc-tree/lib/interface";

/**
 * 获取某一项数据
 */
 export function getTreeDataItem(origin: DataNode[], key: string): DataNode {
  let str = "origin";
  const keys = key.split("-").filter((item) => item);
  keys.forEach((item, index, arr) => {
    if (index === arr.length - 1) {
      str += `[${item}]`;
    } else {
      str += `[${item}].children`;
    }
  });
  return eval(str);
}
