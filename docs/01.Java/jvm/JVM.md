本篇基于

[黑马程序员JVM完整教程，Java虚拟机快速入门，全程干货不拖沓](https://www.bilibili.com/video/BV1yE411Z7AP?spm_id_from=333.337.search-card.all.click)

做的笔记

# 一、JVM概念

**定义**

Java Virtual Machine，JAVA程序的**运行环境**（JAVA二进制字节码的运行环境）

**好处**

- 一次编写到处运行
- 自动内存管理，垃圾回收机制
- 数组下标越界检查

**比较**

JVM、JRE、JDK区别

![image-20220503012607409](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220503012607409.png)

# 二、内存结构

整体架构

![image-20220504172934581](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220504172934581.png)

## 2.1 程序计数器

**作用**

记住下一条JVM指令地址

**特点**

1.线程私有

- CPU会为每个线程分配时间片，当当前线程的时间片使用完以后，CPU就会去执行另一个线程中的代码
- 程序计数器是**每个线程**所**私有**的，当另一个线程的时间片用完，又返回来执行当前线程的代码时，通过程序计数器可以知道应该执行哪一句指令

2.不存在内存溢出



## 2.2 虚拟机栈

**定义**

- 每个**线程**运行需要的内存空间，称为**虚拟机栈**
- 每个栈由多个**栈帧**组成，对应着每次调用方法时所占用的内存
- 每个线程只能有**一个活动栈帧**，对应着**当前正在执行的方法**

**代码**

```java
public class Test {
	public static void main(String[] args) {
		method1();
	}

	private static void method1() {
		method2(1, 2);
	}

	private static int method2(int a, int b) {
		int c = a + b;
		return c;
	}
}
```

**问题辨析**

1、垃圾回收是否涉及栈内存？

- 不涉及。因为栈内存是一次次方法调用所产生的栈帧内存，栈帧内存在每次方法结束调用后，都会被弹出栈，会被自动回收掉

2、栈内存分配越大越好吗？程序跑的越快吗？

- 不是。因为物理内存是一定的，栈内存化的越大，可以支持更多的递归调用，但是反而让可执行线程数变少（逻辑上物理内存=线程数*每个栈内存）不能增加运行效率，一般采用系统默认栈内存

![image-20220504184439843](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220504184439843.png)

3、方法内的局部变量是否线程安全？

- 如果方法内局部变量没有逃离方法的作用范围，则线程安全

  如果局部变量引用了对象，并逃离了方法的作用范围，则需要考虑线程安全

**栈内存溢出**

> Java.lang.stackOverflowError

- 栈帧过多（无限递归）

```java
public class Test {
	public static void main(String[] args) {
		method();
	}
    
	public static void method(){
		method();
	}
}
```

- 栈帧过大（不太容易出现，栈帧中多存局部变量，方法参数等，占用内存较小）

**线程运行诊断**

案例1：CPU占用过多

- top定位cpu占用过高的进程。

- ps H -eo pid, tid（线程id）, %cpu | grep 刚才通过top查到的进程号 通过ps命令进一步查看是哪个线程占用CPU过高

  pid = 32665

- jstack 进程id 通过查看进程中的线程的nid，刚才通过ps命令看到的tid来对比定位，注意jstack查找出的线程id是16进制的，需转换

​		nid = 0x7f99

案例2：程序运行很长时间没有结果

## 2.3 本地方法栈

一些带有**native关键字**的方法就是需要JAVA去调用本地的C或者C++方法，因为JAVA有时候没法直接和操作系统底层交互，所以需要用到本地方法栈

## 2.4 堆

**定义**

通过new关键字创建的对象都会被放在堆内存

**特点**

- 线程共享，堆内存中对象需要考虑线程安全问题
- 有垃圾回收机制

**堆内存溢出**

>  java.lang.OutofMemoryError ：Java heap space. 

```java
public class Test {
	public static void main(String[] args){
		List list=new ArrayList();  //持有“大对象”的引用，防止垃圾回收
		while(true){
			int[] tmp = new int[10000000];  //不断创建“大对象”
			list.add(tmp);
		}
	}
}
```

**内存溢出诊断**

1.jps

- 查看当前系中的Java进程

2.jmap

- 查看堆内存占用情况 jmap - heap pid

3.jconsole

- 图形界面，多功能检测工具，可以连续监控

4.jvirsalvm

## 2.5 方法区

整体架构

![image-20220504225118856](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220504225118856.png)

## 2.6 直接内存

# 三、垃圾回收



# 四、类加载及字节码



# 五、内存模型