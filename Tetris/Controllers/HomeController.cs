﻿using Microsoft.AspNetCore.Mvc;

namespace Tetris.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}