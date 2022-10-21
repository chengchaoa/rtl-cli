module.exports = {
  types: [
    { value: 'feat', name: '✨ 增加新功能' },
    { value: 'fix', name: '🐛 修复bug' },
    { value: 'docs', name: '📝 文档更新' },
    { value: 'perf', name: '⚡ 性能优化' },
    { value: 'init', name: '🎉 初始提交' },
    { value: 'add', name: '➕ 添加依赖' },
    { value: 'build', name: '🔨 对构建系统或者外部依赖项进行了修改(例如 glup， webpack， rollup，npm的配置等)' },
    { value: 'chore', name: '🔧 改变构建流程或者增加依赖库、工具等' },
    { value: 'ci', name: '👷 对CI配置文件或脚本进行了修改(例如 Travis， Jenkins， GitLab CI， Circle等)' },
    { value: 'del', name: '🔥 删除代码/文件' },
    { value: 'refactor', name: '♻️  代码重构' },
    { value: 'revert', name: '⏪ 版本回退' },
    { value: 'style', name: '💄 样式修改不影响逻辑' },
    { value: 'test', name: '✅ 增删测试' },
    { value: 'merge', name: '🔀 分支合并' },
    { value: 'wip', name: '🚧 开发中' }
  ],
  scopes: [],
  messages: {
    type: '选择一种你的提交类型:\n',
    scope: '更改的范围:\n',
    // 如果allowcustomscopes为true，则使用
    // customScope: 'Denote the SCOPE of this change:',
    subject: '简短描述:\n',
    body: '详细描述. 使用"|"换行:\n',
    breaking: 'Breaking Changes列表:\n',
    footer: '关闭的issues列表. E.g.: #31, #34:\n',
    confirmCommit: '确认提交?'
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix']
}
