import './Options.css';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { Autosave, SwitchField, ColorField, TextField, SliderField, BackgroundPicker } from '../Form/Form';
import Logo from '../../Logo/Logo';
import React, { useContext } from 'react';
import { UserStorageContext } from '../../UserStorage/UserStorage';
import { MinusCircle, PlusCircle } from '@styled-icons/heroicons-outline';

const Options = (props) => {
    document.title = "Temperate Options";
    const userStorage = useContext(UserStorageContext).userStorage;
    const setUserStorage = useContext(UserStorageContext).setUserStorage;
    console.log("LINKS", userStorage.links);
    return (
        <div className="Options">
            <div className="centered-narrow">
                <Logo />
                <h1>Preferences</h1>
                <Formik
                    initialValues={userStorage}
                    onSubmit={(values, { setSubmitting }) => {
                        setUserStorage((prev) => { return { ...prev, ...values } });
                        setSubmitting(false);
                    }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <Autosave />

                            <div className="card" id="background">
                                <h2>Background</h2>
                                <div className="form-group">
                                    <SwitchField
                                        name="background.autoImage"
                                        label="Background images that update daily"
                                        onSwitchOff={() => {
                                            setUserStorage((prev) => { return { ...prev, background: { ...prev.background, imgUrl: "" } } });
                                        }}
                                    />
                                    <BackgroundPicker
                                        name="background.imgSource"
                                        label="Daily image category"
                                        detail="Background images update daily from Unsplash"
                                        disabled={!userStorage.background.autoImage}
                                    />
                                    <TextField
                                        name="background.imgUrl"
                                        label="Background image URL"
                                        spellCheck={false}
                                        disabled={userStorage.background.autoImage}
                                    />
                                </div>
                            </div>
                            <div className="card" id="temperature">
                                <h2>Temperature</h2>
                                <div className="form-group">
                                    <SwitchField name="temperature.display" label="Show the current temperature" />
                                    <SwitchField name="temperature.displayCond" label="Show the current condition" />
                                    <SwitchField name="temperature.useCelsius" label="Use Celsius instead of Fahrenheit" />
                                    <SwitchField name="temperature.useFeelsLike" label="Use the Feels Like temperature" />
                                    <SliderField
                                        name="temperature.tempScale"
                                        label="Temperature size adjust"
                                        min={0.2}
                                        max={4}
                                        step={0.1}
                                    />
                                </div>
                            </div>
                            <div className="card" id="links">
                                <h2>Links</h2>
                                <div className="form-group">
                                    <FieldArray name="links">
                                        {({ push, remove }) => (
                                            <div>
                                                {userStorage.links.map((link, index) => (
                                                    <div key={index}>
                                                        <div className="form-group" style={{ marginBottom: 10 }}>
                                                            <TextField
                                                                name={`links.${index}.text`}
                                                                label="Text"
                                                                spellCheck={false}
                                                                width="35"
                                                            />
                                                            <TextField
                                                                name={`links.${index}.link`}
                                                                label="Link"
                                                                spellCheck={false}
                                                                width="52"
                                                            />
                                                            <div class="link-remove">
                                                                <button type="button" onClick={() => remove(index)}><MinusCircle /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="link-add">
                                                    <button type="button" onClick={() => push({ text: '', link: '' })}><PlusCircle />&nbsp;&nbsp;Add link</button>
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
                            <div className="card" id="global">
                                <h2>Global</h2>
                                <div className="form-group">
                                    <SwitchField name="global.use24hr" label="Use 24 hour time" />
                                    <TextField
                                        name="global.locationOverride"
                                        label="Location override"
                                        detail="Override IP-based location estimation"
                                        placeholder="latitude, longitude"
                                        spellCheck={false}
                                    />
                                    <SliderField
                                        name="global.uiScale"
                                        label="User interface size adjust"
                                        min={0.2}
                                        max={4}
                                        step={0.1}
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Options;