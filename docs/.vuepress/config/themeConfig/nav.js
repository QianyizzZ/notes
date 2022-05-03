module.exports = [
    {text: '首页', link: '/'},
    {
        text: 'Java', link: '/java/', items: [
            {
                text: 'Java虚拟机', link: 'jvm/'
            },
            {
                text: 'Java并发编程', link: 'juc/'
            }
        ]
    },
    {
        text: 'Database', link: '/database/', items: [
            {
                text: 'MySQL', link: 'mysql/'
            },
            {
                text: 'MongoDB', link: 'mongodb/'
            },
        ]
    },

    {
        text: 'Framework', link: '/framework/', items: [
            {
                text: 'Mybatis-plus', link: 'mybatis-plus/'
            },
            {
                text: 'SpringBoot', link: 'springboot/'
            },
        ]
    },
    {
        text: 'Development', link: '/dev/', items: [
            {
                text: 'Git', link: 'git/'
            },
        ]
    },
    {
        text: 'Project',
        items: [
            {
                text: 'project-01', link: '/campus01/'
            },
            {
                text: 'project-02', link: '/campus02/'
            },
            {
                text: 'project-03', link: '/campus03/'
            },
        ]
    },
    {text: 'About', link: '/about/'},
]