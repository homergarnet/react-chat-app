using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using social_media_api.Hubs;
using social_media_api.Models;
using social_media_api.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace social_media_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var Cors = Configuration.GetSection("Cors");
            services.AddSignalR();
            services.AddMemoryCache();
            services.AddControllers()
            .AddNewtonsoftJson(opt =>
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "social_media_api", Version = "v1" });
            });

            //services.Configure<SmtpSettings>(Configuration.GetSection("SmtpSettings"));


            services.AddControllers();
            //SQL SERVER CONNECTION HERE

            services.AddDbContext<ChatAppDemoContext>(option =>
            {
               option.UseSqlServer(Configuration.GetConnectionString("ChatAppDemo") ?? "");
            });

            services.AddCors(options =>
            {
                options.AddPolicy("allow-policy", policy =>
                {
                    policy
                    .WithOrigins(Cors.GetSection("Origins").Value ?? "")
                    .WithHeaders(Cors.GetSection("Headers").Value ?? "")
                    .WithMethods(Cors.GetSection("Methods").Value ?? "")
                    .AllowCredentials();
                });
            });

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                // jwt setup
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"] ?? ""))
                };

                // append header when jwt expired
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            services.AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddCors();

            //SERVICES
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IRoomService, RoomService>();
            services.AddTransient<IWaitingListService, WaitingListService>();
            //services.AddTransient<ICompliantService, CompliantService>();
            //services.AddTransient<IAnnouncementService, AnnouncementService>();
            //services.AddTransient<ILocationService, LocationService>();
            //services.AddTransient<IDashboardService, DashboardService>();
            //services.AddTransient<IManageReportService, ManageReportService>();
            //services.AddTransient<IManageCrimeService, ManageCrimeService>();
            //services.AddTransient<IReportsService, ReportsService>();
            //services.AddTransient<IBarangayService, BarangayService>();
            //services.AddTransient<IEmailService, EmailService>();
            //services.AddTransient<IPoliceInOutService, PoliceInOutService>();

            //services.Configure<FormOptions>(options =>
            //{
            //    options.MultipartBodyLengthLimit = 10_000_000; // 10 MB limit per file
            //    options.ValueLengthLimit = int.MaxValue;      // unlimited input length
            //    options.MultipartHeadersLengthLimit = int.MaxValue; // unlimited header length
            //});

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();
            app.UseCors("allow-policy");

            app.UseRouting();

            app.UseCors(option =>
            {
                option.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
            });

            // Local
            //app.UseStaticFiles(new StaticFileOptions()
            //{
            //    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"uploads")),
            //    RequestPath = new PathString("/uploads")
            //});

            // IIS
            // app.UseStaticFiles(new StaticFileOptions()
            // {
            //     FileProvider = new PhysicalFileProvider(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, @"uploads")),
            //     RequestPath = new PathString("/uploads")
            // }); 

            //app.UseHttpsRedirection();

            //app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chathub");
                endpoints.MapHub<WaitingListHub>("/waitinglisthub");
                endpoints.MapControllers();

            });
        }
    }
}
