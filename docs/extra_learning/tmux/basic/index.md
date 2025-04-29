# Tmux使用基础

## 新建会话

直接使用`tmux`命令启动窗口，Tmux会从0开始自动编号，即0号会话、1号会话等。

为了方便区分不同会话，我们可以为会话起名，命令如下：

`tmux new -s <session-name>`

这里的`-s`是session的缩写。



## 分离会话

在Tmux窗口中，输入`tmux detach`命令，便可将当前会话与窗口解绑。与之对应的快捷键是`crtl+B d`。输入`tmux ls`或`tmux list-session`可查看当前所有的Tmux会话。



## 接入会话

使用如下命令可以重新接入某个已存在的会话：

`tmux attach -t <session-name>`

这里的`-t`是target的缩写。





