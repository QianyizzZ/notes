module.exports = [
    {text: 'HomePage', link: '/'},
    {
        text: 'Java', link: '/java/', items: [
            {
                text: 'Java虚拟机', link: '/java/jvm/'
            },
            {
                text: 'Java并发编程', link: '/java/juc/'
            }
        ]
    },
    {
        text: 'Database', link: '/database/', items: [
            {
                text: 'MySQL', link: '/database/mysql/'
            },
            {
                text: 'MongoDB', link: '/database/mongodb/'
            },
        ]
    },

    {
        text: 'Framework', link: '/framework/', items: [
            {
                text: 'Mybatis-plus', link: '/framework/mybatis-plus/'
            },
            {
                text: 'SpringBoot', link: '/framework/springboot/'
            },
        ]
    },
    {
        text: 'Development', link: '/dev/', items: [
            {
                text: 'Git', link: '/dev/git/'
            },
        ]
    },
    {
        text: 'Project', link: '/project/', items: [
            {
                text: 'project-01', link: '/project/campus01/'
            },
            {
                text: 'project-02', link: '/project/campus02/'
            },
            {
                text: 'project-03', link: '/project/campus03/'
            },
        ]
    },
    {text: 'About', link: '/about/'},
]