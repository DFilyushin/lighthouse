import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, colors } from '@material-ui/core';
import Markdown from "../../components/Markdown";
import {Page} from "../../components";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    content: {
        paddingTop: 150,
        textAlign: 'center'
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    },
    divider: {
        backgroundColor: colors.grey[300],
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    markdownContainer: {
        maxWidth: '100%'
    },
}));

const About = () => {
    const classes = useStyles();
    const [source, setSource] = useState('');

    useEffect(() => {
        fetch('/docs/AboutApp.md')
            .then(response => response.text())
            .then(text => setSource(text));
    }, []);

    return (
        <Page
            className={classes.root}
            title="Changelog"
        >
            <Typography
                gutterBottom
                variant="overline"
            >
                Поддержка
            </Typography>
            <Typography variant="h3">О приложении</Typography>
            <Divider className={classes.divider} />
            {source && (
                <div className={classes.markdownContainer}>
                    <Markdown
                        escapeHtml={false}
                        source={source} //
                    />
                </div>
            )}

        </Page>
    );
};

export default About;

