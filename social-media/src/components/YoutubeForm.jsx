import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
let renderCount = 0;
const YoutubeForm = () => {
    const form = useForm({
        defaultValues: async () => {
            const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
            const data = await response.json();
            return {
                username: "Batman", email: data.email, channel: "",
                social: { twitter: "", facebook: "", }, phoneNumbers: ["", ""], phNumbers: [{ number: "" }], age: 0, dob: new Date(),
            };
        }, mode: "onBlur",
    });
    const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger, } = form;
    const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount, } = formState;
    console.log("isSubmitting, isSubmitted, isSubmitSuccessful, submitCount: ", { isSubmitting, isSubmitted, isSubmitSuccessful, submitCount, });
    console.log("touchedFields, dirtyFields, isDirty, isValid: ", { touchedFields, dirtyFields, isDirty, isValid, });
    const { fields, append, remove } = useFieldArray({ name: "phNumbers", control, });
    const onSubmit = (data) => {

        console.log("Form submitted ", data);
    };

    const onError = (errors) => { console.log("Form Errors: ", errors); };

    const handleGetValues = () => {
        console.log("Get Values", getValues());
        console.log("Get Values", getValues("username"));
        console.log("Get Values", getValues(["username", "email"]));
    };
    const handleSetValue = () => {
        setValue("username", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true, });
        setValue("phoneNumbers.0", "123456789");
        setValue("phNumbers.1", { number: "112312" });
    };
    useEffect(() => {
        if (isSubmitSuccessful) { reset(); }
    }, [isSubmitSuccessful, reset]);
    useEffect(() => {
        const subscription = watch((value) => { console.log(value); });
        return () => subscription.unsubscribe();
    }, [watch]);
    const watchUsername = watch("username");
    renderCount++;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                                <h2>Watched value: {watchUsername}</h2>
                                <h1>Youtube Form ({renderCount / 2})</h1>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input className="form-control" type="text" id="username" {...register("username", { required: { value: true, message: "Username is required", }, })} />
                                    <p className="text-danger">{errors.username?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input className="form-control" type="email" id="email" {...register("email", {
                                        pattern: { value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Invalid email form", },
                                        validate: {
                                            notAdmin: (fieldValue) => {
                                                return (fieldValue !== "admin@example.com" || "Enter a different email address");
                                            },
                                            notBlackListed: (fieldValue) => { return (!fieldValue.endsWith("baddomain.com") || "This domain is not supported"); },
                                            emailAvailable: async (fieldValue) => {
                                                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                                                const data = await response.json();
                                                return data.length == 0 || "Email already exists";
                                            },
                                        },
                                    })} />
                                    <p className="text-danger">
                                        {errors.email?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="channel">Channel</label>
                                    <input className="form-control" type="text" id="channel" {...register("channel", { required: { value: true, message: "Channel is required", }, })} />
                                    <p className="text-danger">{errors.channel?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="twitter">Twitter</label>
                                    <input className="form-control" type="text" id="twitter" {...register("social.twitter", { disabled: watch("channel") === "", required: "Enter twitter profile", })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="facebook">Facebook</label>
                                    <input className="form-control" type="text" id="facebook" {...register("social.facebook")} />
                                </div> <div className="form-group">
                                    <label htmlFor="primary-phone">Primary Phone Number</label>
                                    <input className="form-control" type="text" id="primary-phone" {...register("phoneNumbers.0")} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="secondary-phone"> Secondary Phone Number </label>
                                    <input className="form-control" type="text" id="secondary-phone" {...register("phoneNumbers.1")} />
                                </div>
                                <div>
                                    <label>List of phone numbers</label>
                                    <div>
                                        {fields.map((field, index) => {
                                            return (
                                                <div className="container" key={field.id}>
                                                    <div className="row"> <div className="col">
                                                        <input className="form-control" type="number" {...register(`phNumbers.${index}.number`)} />
                                                    </div>
                                                        {index > 0 && (<div className="col">
                                                            <button className="btn btn-primary" type="button" onClick={() => remove(index)} >
                                                                Remove
                                                            </button>
                                                        </div>)}
                                                    </div>
                                                </div>);
                                        })}
                                        <button className="btn btn-success" type="button" onClick={() => append({ number: "" })} >
                                            Add phone number
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input className="form-control" type="number" id="age" {...register("age", { valueAsNumber: true, required: { value: true, message: "Age is required", }, })} />
                                    <p className="text-danger">{errors.age?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input className="form-control" type="date" id="dob" {...register("dob", { valueAsDate: true, required: { value: true, message: "Date of birth is required", }, })} />
                                    <p className="text-danger">{errors.dob?.message}</p>
                                </div>
                                <button className="btn btn-primary" disabled={!isDirty || isValid || isSubmitting} > Submit </button>
                                <button type="button" className="btn btn-primary" onClick={() => reset()} > Reset </button>
                                <button type="button" className="btn btn-primary" onClick={handleGetValues} > Get Values </button>
                                <button type="button" className="btn btn-primary" onClick={handleSetValue} > Set value </button>
                                <button type="button" className="btn btn-primary" onClick={() => trigger("channel")} > Validate </button>
                            </form>
                            <DevTool control={control} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; export default YoutubeForm;