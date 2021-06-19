import React, {useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 140,
    height: 140,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
    margin: '0 auto',
    position: 'relative'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
    objectFit: 'cover'
};

const icon = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    fontSize: '21px',
    cursor: 'pointer',
    zIndex: 2,
    color: '#fff'
}

const DropzoneComponent = ({files = [], onDropped, onRemoved, isMultiple = false}) => {
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        multiple: isMultiple,
        onDrop: acceptedFiles => {
            onDropped(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map(file => {
        if (!file) {
            return <></>;
        }

        return (
            <div style={thumb} key={file.name ? file.name : file}>
                <div style={thumbInner}>
                    <img
                        src={file.preview ? file.preview : file}
                        style={img}
                    />
                    <i className="far fa-times-circle" onClick={() => onRemoved(file)} style={icon}/>
                </div>
            </div>
        )
    });

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <span>📂</span>
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}

export default DropzoneComponent;
