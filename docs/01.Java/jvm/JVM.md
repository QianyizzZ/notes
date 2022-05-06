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

## 1 程序计数器

### 1.1 定义



### 1.2 作用

记住下一条JVM指令地址

**特点**

1.线程私有

- CPU会为每个线程分配时间片，当当前线程的时间片使用完以后，CPU就会去执行另一个线程中的代码
- 程序计数器是**每个线程**所**私有**的，当另一个线程的时间片用完，又返回来执行当前线程的代码时，通过程序计数器可以知道应该执行哪一句指令

2.不存在内存溢出



## 2. 虚拟机栈

### 2.1 定义

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

### 2.2 栈内存溢出

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

### 2.3 线程运行诊断

案例1：CPU占用过多

- top定位cpu占用过高的进程。

- ps H -eo pid, tid（线程id）, %cpu | grep 刚才通过top查到的进程号 通过ps命令进一步查看是哪个线程占用CPU过高

  pid = 32665

- jstack 进程id 通过查看进程中的线程的nid，刚才通过ps命令看到的tid来对比定位，注意jstack查找出的线程id是16进制的，需转换

​		nid = 0x7f99

案例2：程序运行很长时间没有结果

## 3. 本地方法栈

一些带有**native关键字**的方法就是需要JAVA去调用本地的C或者C++方法，因为JAVA有时候没法直接和操作系统底层交互，所以需要用到本地方法栈

## 4. 堆

### 4.1 **定义**

通过new关键字创建的对象都会被放在堆内存

**特点**

- 线程共享，堆内存中对象需要考虑线程安全问题
- 有垃圾回收机制

### 4.2 **堆内存溢出**

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

### 4.3 **堆内存溢出诊断**

1.jps

- 查看当前系中的Java进程

2.jmap

- 查看堆内存占用情况 jmap - heap pid

3.jconsole

- 图形界面，多功能检测工具，可以连续监控

4.jvirsalvm

## 5. 方法区

#### 5.1 定义

#### 5.2 组成

**整体架构**

![image-20220504225118856](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220504225118856.png)

#### 5.3 方法区内存溢出

- 1.8以前会导致**永久代**内存溢出
- 1.8以后会导致**元空间**内存溢出

**常量池**

二进制字节码的组成：类的基本信息、常量池、类的方法定义（包含了虚拟机指令）

**反编译**

- 获取class文件路径（Idea的控制台/JDK的bin目录下执行cmd，在执行javac）
- 执行javap -v path
- 显示类信息

我的方法：

在Idea中将准备好的Java文件进行build，出现out目录

![image-20220505233346729](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220505233346729.png)

找到编译后的Test文件，在Idea的控制台打开

![image-20220505233443959](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220505233443959.png)

控制台执行以下命令出现如下信息

```dom
javap -v Test.class
```

**类基本信息**、**常量池**

![image-20220505233940550](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220505233940550.png)

**虚拟机中执行编译的方法**（框内的是真正编译执行的内容，#号的内容需要在常量池中查找）

![image-20220505234224095](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220505234224095.png)

**常量池**

就是一张表（如上图中Constant pool），虚拟机指令根据这张表找到要执行的类名、方法名等

#### 5.4 运行时常量池

当改类被加载时，常量池信息会放入运行时常量池，并把符号地址转变为真实地址（如#2）

#### 5.5 **StringTable**

特征

- 常量池中的字符串仅是符号，只有在被用到时才会转化为对象
- 利用StringTable的机制，来避免重复创建字符串对象
- 字符串变量拼接的原理是StringBuilder
- 字符串常量拼接的原理是编译器优化
- 可以使用intern方法，主动将StringTable中还没有的字符串对象放入串池中
- 注意：无论是StringTable还是堆里面的字符串，都是对象

用来放字符串对象且里面的元素不重复

```java
public class Test {
	public static void main(String[] args) {
		String a = "a"; 
		String b = "b";
		String ab = "ab";
	}
}
```

常量池中的信息，都会被加载到运行时常量池中，此时a b ab 仅是常量池中的符号，还没有成为java字符串

反编译

```java
0: ldc           #2                  // String a
2: astore_1
3: ldc           #3                  // String b
5: astore_2
6: ldc           #4                  // String ab
8: astore_3
9: return
```

当执行到 ldc #2 时，会把符号 a 变为 “a” 字符串对象，并放入StringTable中（hashtable结构 不可扩容）

当执行到 ldc #3 时，会把符号 b 变为 “b” 字符串对象，并放入StringTable中

当执行到 ldc #4 时，会把符号 ab 变为 “ab” 字符串对象，并放入StringTable中

最终**StringTable [“a”, “b”, “ab”]**

**注意**：字符串对象的创建都是懒惰的，只有当运行到那一行字符串且在StringTable中不存在的时候（如 ldc #2）时，该字符串才会被创建并放入串池中。

```java
public class Test {
	public static void main(String[] args) {
		String a = "a";
		String b = "b";
		String ab = "ab";
		//拼接字符串对象来创建新的字符串
		String ab2 = a+b; 
	}
}
```

反编译

```java
	 Code:
      stack=2, locals=5, args_size=1
         0: ldc           #2                  // String a
         2: astore_1
         3: ldc           #3                  // String b
         5: astore_2
         6: ldc           #4                  // String ab
         8: astore_3
         9: new           #5                  // class java/lang/StringBuilder
        12: dup
        13: invokespecial #6                  // Method java/lang/StringBuilder."<init>":()V
        16: aload_1
        17: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String
;)Ljava/lang/StringBuilder;
        20: aload_2
        21: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String
;)Ljava/lang/StringBuilder;
        24: invokevirtual #8                  // Method java/lang/StringBuilder.toString:()Ljava/lang/Str
ing;
        27: astore        4
        29: return
```

通过拼接的方式来创建字符串的过程是：StringBuilder().append(“a”).append(“b”).toString()

最后的toString方法的返回值是一个新的字符串，但字符串的值和拼接的字符串一致，但是两个不同的字符串，一个存在于StringTable之中，一个存在于堆内存之中

```java
String ab = "ab";
String ab2 = a+b;
System.out.println(ab == ab2);//false,因为ab是存在于串池之中，ab2是由StringBuffer的toString方法所返回的一个对象，存在于堆内存之中
```

使用拼接字符串常量对象的方法创建字符串

```java
public class Test {
	public static void main(String[] args) {
		String a = "a";
		String b = "b";
		String ab = "ab";
		String ab2 = a+b;
		//使用拼接字符串的方法创建字符串
		String ab3 = "a" + "b";
	}
}
```

反编译

```java
 	  Code:
      stack=2, locals=6, args_size=1
         0: ldc           #2                  // String a
         2: astore_1
         3: ldc           #3                  // String b
         5: astore_2
         6: ldc           #4                  // String ab
         8: astore_3
         9: new           #5                  // class java/lang/StringBuilder
        12: dup
        13: invokespecial #6                  // Method java/lang/StringBuilder."<init>":()V
        16: aload_1
        17: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String
;)Ljava/lang/StringBuilder;
        20: aload_2
        21: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String
;)Ljava/lang/StringBuilder;
        24: invokevirtual #8                  // Method java/lang/StringBuilder.toString:()Ljava/lang/Str
ing;
        27: astore        4
        //ab3初始化时直接从串池中获取字符串
        29: ldc           #4                  // String ab
        31: astore        5
        33: return
```

- 使用拼接字符串常量的方法来创建新的字符串时，因为内容是常量，javac在编译期会进行优化，结果已在编译期确定为ab，而创建ab的时候已经在串池中放入了“ab”，所以ab3直接从串池中获取值，所以进行的操作和 ab = “ab” 一致。
- 使用拼接字符串变量的方法来创建新的字符串时，因为内容是变量，只能在运行期确定它的值，所以需要使用StringBuilder来创建

**intern 1.8**

调用字符串对象的intern方法，会将该字符串对象尝试放入到串池中

- 如果串池中没有该字符串对象，则放入成功
- 如果有该字符串对象，则放入失败

无论放入是否成功，都会返回StringTable的字符串对象

**注意**：此时如果调用intern方法成功，堆内存与串池中的字符串对象是同一个对象；如果失败，则不是同一个对象

**例1**

```java
public class Test {
	public static void main(String[] args) {
		//"a" "b" 被放入串池中，str则存在于堆内存之中
		String str = new String("a") + new String("b");
		//调用str的intern方法，这时串池中没有"ab"，则会将该字符串对象放入到串池中，此时堆内存与串池中的"ab"是同一个对象
		String st2 = str.intern();
		//给str3赋值，因为此时串池中已有"ab"，则直接将串池中的内容返回
		String str3 = "ab";
		//因为堆内存与串池中的"ab"是同一个对象，所以以下两条语句打印的都为true
		System.out.println(str == st2);//true
		System.out.println(str == str3);//true
	}
}
```

**例2**

```java
public class Test {
	public static void main(String[] args) {
        //此处创建字符串对象"ab"，因为串池中还没有"ab"，所以将其放入串池中
		String str3 = "ab";
        //"a" "b" 被放入串池中，str则存在于堆内存之中
		String str = new String("a") + new String("b");
        //此时因为在创建str3时，"ab"已存在与串池中，所以放入失败，但是会返回串池中的"ab"
		String str2 = str.intern();
		System.out.println(str == str2);//false
		System.out.println(str == str3);//false
		System.out.println(str2 == str3);//true
	}
}
```

**intern方法 1.6**

调用字符串对象的intern方法，会将该字符串对象尝试放入到串池中

- 如果串池中没有该字符串对象，会将该字符串对象复制一份，再放入到串池中
- 如果有该字符串对象，则放入失败

无论放入是否成功，都会返回**串池中**的字符串对象

**注意**：此时无论调用intern方法成功与否，串池中的字符串对象和堆内存中的字符串对象**都不是同一个对象**

**StringTable 垃圾回收**

StringTable在内存紧张时，会发生垃圾回收

**StringTable 调优**

- 因为StringTable是由HashTable实现的，所以可以**适当增加HashTable桶的个数**，来减少字符串放入串池所需要的时间

  ```
  -XX:StringTableSize=xxxxCopy
  ```

- 考虑是否需要将字符串对象入池

  可以通过**intern方法减少重复入池子**

## 6. 直接内存

### 6.1 定义

- 属于操作系统

- 常见于NIO操作时，用于数据缓冲区
- 分配回收成本较高，但读写性能高
- 不受JVM内存回收管理

文件读写流程

![image-20220506232542089](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220506232542089.png)

使用了**DirectBuffer**

![image-20220506233043387](C:\Users\wxy\AppData\Roaming\Typora\typora-user-images\image-20220506233043387.png)

直接内存是操作系统和Java代码**都可以访问的一块区域**，无需将代码从系统内存复制到Java堆内存，从而提高了效率

# 三、垃圾回收



# 四、类加载及字节码



# 五、内存模型