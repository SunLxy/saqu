import FS from 'fs-extra';
import path from 'path';
import {
  IgnoreFunction,
  TreeObjectDataType,
  RouteTreeDataType,
  RouteItemConfigType,
  RenderReturnType,
} from './interface';

export const isCheckIgnoresFile = (
  filePath: string,
  fileExt: string = 'tsx|js|jsx',
  matchIgnores: IgnoreFunction[],
) => {
  const stats = FS.statSync(filePath);
  if (matchIgnores) {
    const isNotNext = matchIgnores.some(function (matcher) {
      return matcher(filePath, stats);
    });
    if (isNotNext) {
      return false;
    }
  }
  const rgx = new RegExp(`^index.(${fileExt})$`);
  if (rgx.test(filePath) && stats.isFile()) {
    return true;
  }
  // 表示文件忽略
  return false;
};

export const toPascalCase = (str: string = '') =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('');

export const getRoutePath = (filePath: string) => {
  // 1. 跳转地址
  // 2. 引入名称
  const rootDir = path.join(process.cwd(), 'src');
  const newFilePath = filePath
    .replace(rootDir, '')
    .replace(path.extname(filePath), '')
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .replace(/\/index$/, '');

  const oFilePath = filePath.replace(/\\/g, '/').replace(/^\//, '');
  const componentName = toPascalCase(newFilePath.replace(/\\/g, ' '));
  const pathName = newFilePath.replace('pages', '');

  return {
    componentName,
    newFilePath: `@/` + newFilePath,
    pathName: pathName || '/',
    oFilePath: `@/` + oFilePath,
  };
};

/**
 * 1. 递归循环数据
 * 2. 判断对象中字段值是否是对象，如果是则进行递归，
 * 3. 如果是字符串，直接拼接路由赋值
 * 4. 如果既不是对象也不是字符串，则忽略
 * */
export const createTreeObjectRoutes = (data: TreeObjectDataType) => {
  const newData: RouteTreeDataType = {};
  Object.entries(data).forEach(([key, value]) => {
    //  如果 key = index
    if (key === 'index' && typeof value === 'string') {
      let newValue = value.replace(/\\/g, '/');
      if (/^\//.test(newValue)) {
        newValue = `/pages${newValue}`;
      } else {
        newValue = `/pages/${newValue}`;
      }
      const result = getRoutePath(newValue);
      console.log('result', result);
      newData[key] = result;
    } else if (value && Object.prototype.toString.call(value) === '[object Object]') {
      const result = createTreeObjectRoutes(value as TreeObjectDataType);
      newData[key] = result;
    }
  });
  return newData;
};

/**添加路由*/
export const addRoutes = (pathName: string, newData: RouteTreeDataType) => {
  const rootDir = path.join(process.cwd(), 'src', 'pages');
  const list = pathName.replace(rootDir, '').replace(/\\/g, '/').split('/').filter(Boolean);

  let preData: RouteTreeDataType = newData;
  let lg = list.length;
  let index = 0;

  for (index; index < lg; index++) {
    const key = list[index];
    if (index === lg - 1) {
      break;
    }
    if (preData[key]) {
      // 如果存在
      preData = preData[key] as RouteTreeDataType;
    } else {
      // 如果不存在 则对数据进行创建和存储
      preData[key] = {};
      preData = preData[key] as RouteTreeDataType;
    }
  }
  const result = getRoutePath(pathName);
  preData.index = result;

  return newData;
};

/**删除路由*/
export const removeRoutes = (pathName: string, newData: RouteTreeDataType) => {
  const rootDir = path.join(process.cwd(), 'src', 'pages');
  const list = pathName.replace(rootDir, '').replace(/\\/g, '/').split('/').filter(Boolean);
  /**
   * 1. 先根据路径找到路径数据
   * 2. 根据路径从从最底层进行删除
   */
  const treeListData: { key: string; data: RouteTreeDataType }[] = [];

  const lg = list.length;
  let temp = newData;
  let isDelete = false;

  list.forEach((key, index) => {
    if (lg - 1 === index) {
      if (temp.index) {
        isDelete = true;
      }
      // 判断是否存在 index，如果存在则进行数据删除，不存在则不进行删除
    } else if (temp[key]) {
      treeListData.push({ key, data: temp });
      temp = temp[key] as RouteTreeDataType;
    }
  });

  if (isDelete && treeListData.length) {
    const list = treeListData.reverse();
    const lg = list.length;
    for (let index = 0; index < lg; index++) {
      const obj = list[index];
      if (obj.key) {
        delete obj.data[obj.key];
      }
      // 删除 index 后判断当前数据是否为空对象
      if (Object.keys(obj.data).length) {
        break;
      }
    }
    return isDelete;
  }

  return isDelete;
};

const createPreTabs = (num: number) => {
  return Array.from({ length: num * 2 })
    .map(() => `\t`)
    .join('');
};

/**生成路由code*/
export const createRouteCode = (
  newData: RouteTreeDataType,
  isDefault: boolean = false,
  render?: (props: Required<RouteItemConfigType>) => RenderReturnType,
  presetsImport?: string,
  rootRoutes?: boolean | string,
) => {
  let importStr = (presetsImport || '') + '\n';
  let otherStr = '';
  let sum = 0;
  let firstItem = '';

  const getConfig = (index: RouteItemConfigType) => {
    sum++;
    const { pathName, componentName, newFilePath } = index;
    const ComName = componentName + `${sum}`;
    let routesStr = '';
    if (typeof render === 'function') {
      const result = render({ ...index, index: sum });
      importStr += result.importStr || '';
      otherStr += result.otherStr || '';
      if (rootRoutes && typeof rootRoutes === 'boolean' && pathName === '/') {
        firstItem = result.otherStr || '';
      } else {
        routesStr += result.configStr || '';
      }
    } else {
      // 是否是默认导出
      if (isDefault) {
        importStr += `import ${ComName} from "${newFilePath}";\n`;
        if (typeof rootRoutes === 'boolean' && rootRoutes && pathName === '/') {
          firstItem = ` path: "${pathName}",element:<${ComName} /> `;
        } else {
          routesStr = `{ path: "${pathName}",element:<${ComName} />, },\n`;
        }
      } else {
        importStr += `import * as ${ComName} from "${newFilePath}";\n`;
        otherStr += `const { default:${ComName}Default,...${ComName}Other  } = ${ComName};\n`;
        if (typeof rootRoutes === 'boolean' && rootRoutes && pathName === '/') {
          firstItem = `  path:"${pathName}",...${ComName}Other  `;
        } else {
          routesStr = `\t{ path:"${pathName}",...${ComName}Other },\n`;
        }
      }
    }
    return routesStr;
  };

  const loop = (data: RouteTreeDataType, parentList: string[] = [], level: number = 1) => {
    const { index, ...rest } = data || {};
    let routesStr = '';
    let count = 1;
    const tabs = createPreTabs(level);
    // 如果只有一个 index 则直接返回数据
    if (index && Object.keys(rest).length === 0) {
      return {
        childStr: getConfig(index as RouteItemConfigType),
        count,
      };
    } else if (index) {
      sum++;
      routesStr += getConfig(index as RouteItemConfigType);
    }

    Object.entries(rest).forEach(([key, itemValue]) => {
      const childResult = loop(itemValue as RouteTreeDataType, parentList.concat([key]), level + 1);
      const nextTabs = createPreTabs(level + 1);
      if (childResult.count > 1) {
        // 说明子集数据存在多个
        routesStr += `${tabs}{ path:"${parentList.concat([key]).join('/')}", children:[\n${
          childResult.childStr
        }${nextTabs}],\n${tabs}},\n`;
      } else {
        routesStr += `${tabs}${childResult.childStr}`;
      }
      count++;
    });
    return {
      childStr: routesStr,
      count,
    };
  };
  const routesDataStr = loop(newData);
  let childData = ` [\n${routesDataStr.childStr}\n]`;
  if (typeof rootRoutes === 'boolean' && rootRoutes) {
    const newFirstItem = firstItem.trim().replace(/,$/, '');
    childData = `{ ${newFirstItem},children:${childData}\n }`;
  } else if (typeof rootRoutes === 'string') {
    importStr = `import RootRoutes from "${rootRoutes}";\n` + importStr;
    childData = `{ path:"/",element:<RootRoutes />,children:${childData}\n }`;
  }
  return `${importStr}\n${otherStr}\nexport default [\n${childData}\n]`;
};
