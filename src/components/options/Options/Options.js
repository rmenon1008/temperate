import './Options.css';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { Autosave, SwitchField, ColorField, TextField, SliderField, BackgroundPicker } from '../Form/Form';
import { Logo } from '../../Logo/Logo';
import React, { useContext, useEffect } from 'react';
import { UserStorageContext } from '../../UserStorage/UserStorage';
import { MinusCircle, PlusCircle, FolderAdd } from '@styled-icons/heroicons-outline';

const Options = (props) => {
    document.title = "Temperate Options";
    const userStorage = useContext(UserStorageContext).userStorage;
    const setUserStorage = useContext(UserStorageContext).setUserStorage;

    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = 'favicon-green.svg';
    }, []);

    return (
        <div className="Options">
            <div className="centered-narrow">
                <Logo />
                <h1>Options</h1>
                <Formik
                    initialValues={userStorage}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                        setUserStorage((prev) => { return { ...prev, ...values } });
                        setSubmitting(false);
                    }}>
                    {({ isSubmitting, setFieldValue, setValues }) => (
                        <Form>
                            <Autosave />
                            <div className="card" id="global">
                                <h2>General</h2>
                                <div className="form-group">
                                    <SwitchField
                                        name="global.usePreciseLocation"
                                        label="Use your precise location for weather data"
                                        onSwitch={() => setFieldValue("global.locationOverride", "")}
                                    />
                                    <TextField
                                        name="global.locationOverride"
                                        label="Location override"
                                        disabled={userStorage.global.usePreciseLocation}
                                        detail="Override IP-based location estimation"
                                        placeholder="latitude, longitude"
                                        spellCheck={false}
                                    />
                                    <SwitchField name="global.use24h" label="Use 24 hour time" />
                                    <SliderField
                                        name="global.uiScale"
                                        label="User interface size adjust"
                                        min={0.2}
                                        max={4}
                                        step={0.1}
                                        float
                                    />
                                </div>
                            </div>
                            <div className="card" id="background">
                                <h2>Background</h2>
                                <div className="form-group">
                                    <SwitchField
                                        name="background.autoImage"
                                        label="Background images that update daily"
                                        onSwitch={(turnedOn) => setFieldValue("background.imgUrl", "")}
                                    />
                                    <BackgroundPicker
                                        name="background.imgSource"
                                        label="Daily image category"
                                        detail="Background images update daily from Unsplash"
                                        disabled={!userStorage.background.autoImage}
                                    />
                                    <TextField
                                        name="background.imgUrl"
                                        label="Background image override"
                                        placeholder="https://example.com/image.jpg"
                                        spellCheck={false}
                                        disabled={userStorage.background.autoImage}
                                    />
                                </div>
                            </div>
                            <div className="card" id="temperature">
                                <h2>Temperature</h2>
                                <div className="form-group">
                                    <SwitchField name="temperature.display" label="Show the current temperature" />
                                    <SwitchField name="temperature.displayCond" label="Show the current condition" disabled={!userStorage.temperature.display} />
                                    <SwitchField name="temperature.useCelsius" label="Use Celsius instead of Fahrenheit" disabled={!userStorage.temperature.display} />
                                    <SwitchField name="temperature.useFeelsLike" label="Use the Feels Like temperature" disabled={!userStorage.temperature.display} />
                                    <SliderField
                                        disabled={!userStorage.temperature.display}
                                        name="temperature.tempScale"
                                        label="Temperature size adjust"
                                        min={0.2}
                                        max={4}
                                        step={0.1}
                                        float
                                    />
                                </div>
                            </div>
                            <div className="card" id="graph">
                                <h2>Graph</h2>
                                <div className="form-group">
                                    <SwitchField name="graph.display" label="Show the forecast graph" />
                                    <SwitchField name="graph.displayPercip" label="Show the precipitation forecast" disabled={!userStorage.graph.display} />
                                    <SliderField
                                        disabled={!userStorage.graph.display}
                                        name="graph.maxHours"
                                        label="Hours to show"
                                        min={2}
                                        max={24}
                                        step={2}
                                    />
                                </div>
                            </div>
                            <div className="card" id="links">
                                <h2>Links</h2>
                                <div className="form-group">
                                    <FieldArray name="links">
                                        {({ push, remove }) => (
                                            <div style={{ width: '100%' }}>
                                                {userStorage.links.map((link, index) => (
                                                    <div key={index}>
                                                        {link.nested ? (
                                                            <div>
                                                                <div className="link-group category">
                                                                    <TextField
                                                                        name={`links.${index}.text`}
                                                                        label="Category name"
                                                                        fullWidth
                                                                    />
                                                                    <div className="link-remove">
                                                                        <button type="button" onClick={() => remove(index)}><MinusCircle /></button>
                                                                    </div>
                                                                </div>
                                                                <FieldArray name={`links.${index}.nested`}>
                                                                    {({ push: pushNested, remove: removeNested }) => (
                                                                        <div>
                                                                            {link.nested.map((linkNested, indexNested) => (
                                                                                <div className="link-group nested">
                                                                                    <TextField
                                                                                        name={`links.${index}.nested.${indexNested}.text`}
                                                                                        label="Text"
                                                                                    />
                                                                                    <TextField
                                                                                        name={`links.${index}.nested.${indexNested}.link`}
                                                                                        label="Link"
                                                                                        spellCheck={false}
                                                                                    />
                                                                                    <div class="link-remove">
                                                                                        <button type="button" onClick={() => removeNested(indexNested)}><MinusCircle /></button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            < div className="link-add nested">
                                                                                <button type="button" onClick={() => pushNested({ text: '', link: '' })}><PlusCircle />&nbsp;&nbsp;Add link</button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </FieldArray>
                                                            </div>
                                                        ) : (
                                                            <div className="link-group">
                                                                <TextField
                                                                    name={`links.${index}.text`}
                                                                    label="Text"
                                                                />
                                                                <TextField
                                                                    name={`links.${index}.link`}
                                                                    label="Link"
                                                                    spellCheck={false}
                                                                />
                                                                <div class="link-remove">
                                                                    <button type="button" onClick={() => remove(index)}><MinusCircle /></button>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                ))}
                                                <div className="link-add">
                                                    <button type="button" onClick={() => push({ text: '', link: '' })}><PlusCircle />&nbsp;&nbsp;Add link</button>
                                                </div>
                                                <div className="link-add">
                                                    <button type="button" onClick={() => push({ text: '', nested: [] })}><FolderAdd />&nbsp;&nbsp;Add category</button>
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>
                            <div className="card" id="colors">
                                <h2>Colors</h2>
                                <div className="form-group">
                                    <SwitchField name="colors.autoColor" label="Automatic colors" detail="Let Temperate choose colors to match the daily image (a daily image must set)" disabled={!userStorage.background.autoImage} />
                                    <ColorField name="colors.cbg" label="Background color" disabled={userStorage.colors.autoColor && userStorage.background.autoImage} />
                                    <ColorField name="colors.c1" label="Primary color" disabled={userStorage.colors.autoColor && userStorage.background.autoImage} />
                                    <ColorField name="colors.c2" label="Secondary color" disabled={userStorage.colors.autoColor && userStorage.background.autoImage} />
                                    <ColorField name="colors.c3" label="Tertiary color" disabled={userStorage.colors.autoColor && userStorage.background.autoImage} />
                                </div>
                            </div>
                            <button
                                className="delete-all card"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to reset all your user options?')) {
                                        setUserStorage({});
                                        window.chrome.storage.sync.clear();
                                        window.location.reload();
                                    }
                                }}
                            >
                                Reset all settings
                            </button>
                        </Form>
                    )}
                </Formik >
            </div >
        </div >
    )
}

export default Options;