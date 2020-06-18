import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from "../../components/Markdown";
import {Page} from 'components';
import { Typography, Divider, colors } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3, 3, 6, 3)
    },
    paper: {
        height: 140,
        width: 200,
    },
    control: {
        padding: theme.spacing(2),
    },
    container: {
        marginTop: theme.spacing(3)
    },
    markdownContainer: {
        maxWidth: 700
    },
    divider: {
        backgroundColor: colors.grey[300],
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
}));

const Changelog = () => {
    const classes = useStyles();
    const [source, setSource] = useState('');

    useEffect(() => {
        fetch('/docs/Changelog.md')
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
            <Typography variant="h3">Изменения</Typography>
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

export default Changelog;
