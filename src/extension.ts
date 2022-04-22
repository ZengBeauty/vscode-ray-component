import * as vscode from "vscode";

const componentURL = "https://ray.tuya-inc.cn/components";

// 驼峰转下划线

function camelToUnderline(str: string) {
  return str.replace(/([A-Z])/g, (match) => {
		if(str.indexOf(match) === 0) {
			return match.toLowerCase();
		}else{
			return `-${match.toLowerCase()}`;
		}
	});
}

function provideHover(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken
) {
  // 获取当前页面的文本
  const fileText = document.getText();

  // 判断当前页面是否包含 @ray/components
  if (fileText.indexOf("@ray/components") !== -1) {
    // 获取当前鼠标获取到的单词
    const currentWorld = document.getText(
      document.getWordRangeAtPosition(position)
    );

    // 获取 @ray/components 的 index 值
    const rayComponentsIndex = fileText.indexOf("@ray/components");

    // 获取 @ray/components 的位置

    const rayComponentsPosition = document.positionAt(rayComponentsIndex);

    const { line, character } = rayComponentsPosition;

    // 获取 import {} from '@ray/components' 那一行的 {} 内容
    const rayComponentLineText = document.getText(
      new vscode.Range(
        new vscode.Position(line, 6),
        new vscode.Position(line, character - 6)
      )
    );

		// 判断 currentWorld 是否存在在 rayComponentLineText 中
    if (rayComponentLineText.indexOf(currentWorld) !== -1) {
      const content = `Ray: 查看 [${currentWorld} 组件](${componentURL}/${camelToUnderline(
        currentWorld
      )})官方文档`;

      return new vscode.Hover(content);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-ray-component" is now active!'
  );

  let hoverComponents = vscode.languages.registerHoverProvider(
    ["typescript", "javascript", "javascriptreact", "typescriptreact"],
    {
      provideHover,
    }
  );

  // 将命令放入其上下文对象中，使其生效
  context.subscriptions.push(hoverComponents);
}

// this method is called when your extension is deactivated
export function deactivate() {}
